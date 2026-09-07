/**
 * Accès aux trois sources de données externes (open data Loire-Atlantique
 * pour les restaurants et bibliothèques, OpenStreetMap/Overpass pour les bars).
 *
 * Aucune clé d'API n'est nécessaire : les jeux de données sont publics.
 */

export type PlaceCategory = 'Restaurant' | 'Bar' | 'Bibliothèque';

export interface Place {
  id: string;
  title: string;
  description: string;
  category: PlaceCategory;
  tags: string[];
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
}

/** Sources interrogées, pour pouvoir signaler précisément laquelle a échoué. */
export const PLACE_SOURCES: PlaceCategory[] = ['Restaurant', 'Bar', 'Bibliothèque'];

const REQUEST_TIMEOUT_MS = 12_000;
const RESULTS_PER_SOURCE = 20;

const OPENDATA_BASE = 'https://data.loire-atlantique.fr/api/explore/v2.1/catalog/datasets';
const RESTAURANTS_DATASET = '793866443_restaurants-en-loire-atlantique';
const LIBRARIES_DATASET = '314549262_bibliotheques-et-mediatheques-en-loire-atlantique';
const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';

/**
 * `fetch` avec délai maximal : sans cela un réseau lent laisse l'écran
 * bloqué indéfiniment sur son indicateur de chargement.
 */
async function fetchJson(url: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} sur ${url}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

/** Identifiant déterministe : l'API v2.1 ne renvoie pas de `recordid`. */
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toNumber(value: unknown): number | undefined {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function fetchRestaurants(): Promise<Place[]> {
  const url =
    `${OPENDATA_BASE}/${RESTAURANTS_DATASET}/records` +
    `?limit=${RESULTS_PER_SOURCE}&offset=0&timezone=UTC&include_links=false&include_app_metas=false`;
  const data = await fetchJson(url);

  return (data.results ?? []).map((r: any, index: number): Place => ({
    id: `restaurant-${slugify(r.nomoffre ?? '')}-${r.codeinseecommune ?? index}`,
    title: r.nomoffre || 'Nom non disponible',
    description: r.type ? `${r.type} - ${r.categorie ?? ''}`.trim() : 'Description non disponible',
    category: 'Restaurant',
    tags: r.commune ? [r.commune] : [],
    latitude: toNumber(r.latitude),
    longitude: toNumber(r.longitude),
  }));
}

export async function fetchBars(): Promise<Place[]> {
  const query = `[out:json][timeout:25];area["name"="Nantes"]["admin_level"=8]->.searchArea;(node["amenity"="bar"](area.searchArea);way["amenity"="bar"](area.searchArea);relation["amenity"="bar"](area.searchArea););out center ${RESULTS_PER_SOURCE};`;
  const data = await fetchJson(`${OVERPASS_ENDPOINT}?data=${encodeURIComponent(query)}`);

  return (data.elements ?? []).map((b: any): Place => ({
    // Overpass fournit déjà un identifiant stable, unique par type d'élément.
    id: `bar-${b.type}-${b.id}`,
    title: b.tags?.name || 'Nom non disponible',
    description:
      b.tags?.['contact:street'] || b.tags?.['addr:street'] || 'Adresse non disponible',
    category: 'Bar',
    tags: b.tags?.['addr:city'] ? [b.tags['addr:city']] : ['Nantes'],
    // Les `way`/`relation` n'ont pas de lat/lon propres : Overpass renvoie `center`.
    latitude: toNumber(b.lat ?? b.center?.lat),
    longitude: toNumber(b.lon ?? b.center?.lon),
  }));
}

export async function fetchLibraries(): Promise<Place[]> {
  const url =
    `${OPENDATA_BASE}/${LIBRARIES_DATASET}/records` +
    `?select=${encodeURIComponent('id, nom, adresse, ville, latitude, longitude')}` +
    `&limit=${RESULTS_PER_SOURCE}`;
  const data = await fetchJson(url);

  return (data.results ?? []).map((l: any, index: number): Place => ({
    id: `bibliotheque-${l.id ?? slugify(l.nom ?? String(index))}`,
    title: l.nom || 'Nom non disponible',
    description: [l.adresse, l.ville].filter(Boolean).join(', ') || 'Adresse non disponible',
    category: 'Bibliothèque',
    tags: l.ville ? [l.ville] : [],
    latitude: toNumber(l.latitude),
    longitude: toNumber(l.longitude),
  }));
}

export interface PlacesResult {
  places: Place[];
  /** Sources injoignables : permet d'afficher un résultat partiel plutôt qu'une liste vide. */
  failedSources: PlaceCategory[];
}

/**
 * Interroge les trois sources en parallèle. `allSettled` (et non `all`) pour
 * qu'une source indisponible ne vide pas toute la liste.
 */
export async function fetchAllPlaces(): Promise<PlacesResult> {
  const results = await Promise.allSettled([fetchRestaurants(), fetchBars(), fetchLibraries()]);

  const places: Place[] = [];
  const failedSources: PlaceCategory[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      places.push(...result.value);
    } else {
      failedSources.push(PLACE_SOURCES[index]);
      console.warn(`Source indisponible (${PLACE_SOURCES[index]}) :`, result.reason);
    }
  });

  return { places, failedSources };
}
