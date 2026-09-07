import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { fetchAllPlaces, type Place, type PlaceCategory } from '@/lib/places';

interface PlacesContextValue {
  places: Place[];
  loading: boolean;
  /** Sources injoignables lors du dernier chargement. */
  failedSources: PlaceCategory[];
  /** Vrai uniquement si aucune source n'a répondu. */
  hasFailed: boolean;
  refresh: () => Promise<void>;
  getPlaceById: (id: string) => Place | undefined;
}

const PlacesContext = createContext<PlacesContextValue | undefined>(undefined);

/**
 * Charge les lieux une seule fois et les partage entre la liste et l'écran
 * de détail : sans cet état partagé, `/places/[id]` n'a aucun moyen de
 * retrouver le lieu correspondant à l'identifiant de la route.
 */
export function PlacesProvider({ children }: { children: React.ReactNode }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [failedSources, setFailedSources] = useState<PlaceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAllPlaces();
      setPlaces(result.places);
      setFailedSources(result.failedSources);
    } catch (error) {
      // fetchAllPlaces absorbe déjà les échecs par source ; on ne passe ici
      // qu'en cas d'erreur inattendue.
      console.error('Chargement des lieux impossible :', error);
      setPlaces([]);
      setFailedSources(['Restaurant', 'Bar', 'Bibliothèque']);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getPlaceById = useCallback(
    (id: string) => places.find((place) => place.id === id),
    [places]
  );

  const value = useMemo<PlacesContextValue>(
    () => ({
      places,
      loading,
      failedSources,
      hasFailed: failedSources.length === 3,
      refresh: load,
      getPlaceById,
    }),
    [places, loading, failedSources, load, getPlaceById]
  );

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
}

export function usePlaces(): PlacesContextValue {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces doit être utilisé à l’intérieur de <PlacesProvider>');
  }
  return context;
}
