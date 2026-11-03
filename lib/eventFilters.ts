import evenements from '@/assets/data/evenements.json';

export type Evenement = (typeof evenements)[number];

/**
 * Correspondance entre les pastilles de filtre affichées sur la carte et le
 * vocabulaire de tags réellement présent dans le jeu de données.
 * Ces pastilles étaient purement décoratives : aucun `onPress` n'y était câblé.
 */
export type EventFilterKey = 'Tous' | 'Event' | 'Resto' | 'Concert' | 'Culture' | 'Nature';

interface EventFilter {
  key: EventFilterKey;
  label: string;
  /** Tags (en minuscules) considérés comme appartenant à ce filtre. */
  tags: readonly string[];
}

export const EVENT_FILTERS: readonly EventFilter[] = [
  { key: 'Tous', label: 'Tous', tags: [] },
  { key: 'Event', label: '🎉 Event', tags: ['soirée', 'fête', 'festival', 'open air', 'animations', 'apéro'] },
  { key: 'Resto', label: '🍽 Resto', tags: ['food', 'marché', 'apéro'] },
  { key: 'Concert', label: '🎶 Concert', tags: ['concert', 'musique', 'dj set', 'électro'] },
  { key: 'Culture', label: '🏛️ Culture', tags: ['culture', 'art', 'expo', 'musée', 'théâtre', 'spectacle'] },
  { key: 'Nature', label: '🌳 Nature', tags: ['découverte', 'sport', 'famille'] },
];

export function filterEvenements(items: Evenement[], filterKey: EventFilterKey): Evenement[] {
  const filter = EVENT_FILTERS.find((f) => f.key === filterKey);
  if (!filter || filter.tags.length === 0) {
    return items;
  }

  return items.filter((item) =>
    (item.tags ?? []).some((tag) => filter.tags.includes(tag.toLowerCase()))
  );
}

/** Coordonnées exploitables d'un événement, ou `null` si elles sont absentes. */
export function getEventCoordinates(
  evenement: Evenement
): { latitude: number; longitude: number } | null {
  const latitude = Number(evenement.coordinates?.[0]?.[0]);
  const longitude = Number(evenement.coordinates?.[0]?.[1]);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }
  if (latitude === 0 && longitude === 0) {
    return null;
  }
  return { latitude, longitude };
}
