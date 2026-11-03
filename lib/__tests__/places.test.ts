import { fetchAllPlaces, fetchBars, fetchLibraries, fetchRestaurants } from '@/lib/places';

const originalFetch = global.fetch;

function mockFetchOnce(payload: unknown, ok = true) {
  return jest.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: async () => payload,
  });
}

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('fetchRestaurants', () => {
  it('produit un identifiant déterministe (l’API ne renvoie pas de recordid)', async () => {
    const payload = {
      results: [{ nomoffre: 'Le Café Zébré', codeinseecommune: '44109', type: 'Restaurant', categorie: 'Bistrot', commune: 'Nantes', latitude: 47.21, longitude: -1.55 }],
    };
    global.fetch = mockFetchOnce(payload) as any;

    const first = await fetchRestaurants();
    global.fetch = mockFetchOnce(payload) as any;
    const second = await fetchRestaurants();

    expect(first[0].id).toBe(second[0].id);
    expect(first[0].id).toBe('restaurant-le-cafe-zebre-44109');
  });

  it('n’envoie aucune clé d’API dans l’URL', async () => {
    const spy = mockFetchOnce({ results: [] });
    global.fetch = spy as any;

    await fetchRestaurants();

    expect(spy.mock.calls[0][0]).not.toContain('apikey');
  });

  it('remplace les champs manquants par des valeurs lisibles', async () => {
    global.fetch = mockFetchOnce({ results: [{}] }) as any;
    const [place] = await fetchRestaurants();
    expect(place.title).toBe('Nom non disponible');
    expect(place.description).toBe('Description non disponible');
  });
});

describe('fetchBars', () => {
  it('utilise le centre géométrique pour les ways sans lat/lon propres', async () => {
    global.fetch = mockFetchOnce({
      elements: [{ type: 'way', id: 42, center: { lat: 47.2, lon: -1.5 }, tags: { name: 'Bar test' } }],
    }) as any;

    const [bar] = await fetchBars();
    expect(bar.latitude).toBe(47.2);
    expect(bar.longitude).toBe(-1.5);
    expect(bar.id).toBe('bar-way-42');
  });
});

describe('fetchLibraries', () => {
  it('demande explicitement le champ id, nécessaire à la navigation', async () => {
    const spy = mockFetchOnce({ results: [] });
    global.fetch = spy as any;

    await fetchLibraries();

    expect(decodeURIComponent(String(spy.mock.calls[0][0]))).toContain('id');
  });
});

describe('fetchAllPlaces', () => {
  it('conserve les sources disponibles quand une autre échoue', async () => {
    global.fetch = jest
      .fn()
      // restaurants : OK
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ results: [{ nomoffre: 'A' }] }) })
      // bars : en panne
      .mockRejectedValueOnce(new Error('réseau indisponible'))
      // bibliothèques : OK
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ results: [{ id: 7, nom: 'B' }] }) }) as any;

    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { places, failedSources } = await fetchAllPlaces();

    // Avec Promise.all, une seule panne vidait toute la liste.
    expect(places).toHaveLength(2);
    expect(failedSources).toEqual(['Bar']);
  });

  it('signale les trois sources en échec sans lever d’exception', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('hors ligne')) as any;
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { places, failedSources } = await fetchAllPlaces();

    expect(places).toEqual([]);
    expect(failedSources).toHaveLength(3);
  });

  it('traite une réponse HTTP en erreur comme un échec de source', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) }) as any;
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { failedSources } = await fetchAllPlaces();
    expect(failedSources).toHaveLength(3);
  });
});
