import evenements from '@/assets/data/evenements.json';
import {
  EVENT_FILTERS,
  filterEvenements,
  getEventCoordinates,
  type Evenement,
} from '@/lib/eventFilters';

function makeEvent(overrides: Partial<Evenement> = {}): Evenement {
  return {
    id: 1,
    date: 'du 1 au 2 janvier',
    title: 'Test',
    tags: [],
    location: 'Nantes',
    descriptions: '',
    image: '',
    coordinates: [['47.21', '-1.55']],
    link: 'https://example.org',
    ...overrides,
  } as Evenement;
}

describe('filterEvenements', () => {
  it('renvoie tous les événements pour le filtre "Tous"', () => {
    expect(filterEvenements(evenements, 'Tous')).toHaveLength(evenements.length);
  });

  it('ne garde que les événements portant un tag du filtre', () => {
    const items = [
      makeEvent({ id: 1, tags: ['Concert'] }),
      makeEvent({ id: 2, tags: ['Expo'] }),
    ];
    const result = filterEvenements(items, 'Concert');
    expect(result.map((e) => e.id)).toEqual([1]);
  });

  it('compare les tags sans tenir compte de la casse', () => {
    const items = [makeEvent({ tags: ['DJ SET'] })];
    expect(filterEvenements(items, 'Concert')).toHaveLength(1);
  });

  it('ne renvoie rien plutôt que de planter sur un événement sans tags', () => {
    const items = [makeEvent({ tags: [] })];
    expect(filterEvenements(items, 'Culture')).toEqual([]);
  });

  it('chaque filtre du jeu de données réel remonte au moins un événement', () => {
    const withoutAll = EVENT_FILTERS.filter((f) => f.key !== 'Tous');
    for (const filter of withoutAll) {
      expect(filterEvenements(evenements, filter.key).length).toBeGreaterThan(0);
    }
  });
});

describe('getEventCoordinates', () => {
  it('convertit les coordonnées textuelles en nombres', () => {
    const event = makeEvent({ coordinates: [['47.2181', '-1.5528']] });
    expect(getEventCoordinates(event)).toEqual({ latitude: 47.2181, longitude: -1.5528 });
  });

  it('renvoie null si les coordonnées sont absentes', () => {
    expect(getEventCoordinates(makeEvent({ coordinates: [] }))).toBeNull();
  });

  it('renvoie null sur des coordonnées non numériques', () => {
    const event = makeEvent({ coordinates: [['', '']] as any });
    expect(getEventCoordinates(event)).toBeNull();
  });

  it('rejette le point (0, 0), qui signale une extraction ratée', () => {
    const event = makeEvent({ coordinates: [['0', '0']] });
    expect(getEventCoordinates(event)).toBeNull();
  });
});

describe('jeu de données embarqué', () => {
  it('ne contient aucun identifiant en double', () => {
    const ids = evenements.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("n'expose que des coordonnées exploitables", () => {
    for (const event of evenements) {
      expect(getEventCoordinates(event)).not.toBeNull();
    }
  });
});
