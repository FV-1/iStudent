import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { ListCard } from '@/components/ListCard';
import { Brand, HEADER_HEIGHT } from '@/constants/theme';
import { usePlaces } from '@/contexts/PlacesContext';
import type { PlaceCategory } from '@/lib/places';

type Filter = 'Tous' | PlaceCategory;
const FILTERS: Filter[] = ['Tous', 'Restaurant', 'Bar', 'Bibliothèque'];

export default function AllPlacesScreen() {
  const router = useRouter();
  const { places, loading, failedSources, hasFailed, refresh } = usePlaces();
  const [filter, setFilter] = useState<Filter>('Tous');

  const filteredPlaces = useMemo(
    () => (filter === 'Tous' ? places : places.filter((p) => p.category === filter)),
    [places, filter]
  );

  return (
    <View style={{ flex: 1 }}>
      <AppHeader />

      <View style={styles.filterContainer}>
        {FILTERS.map((cat) => {
          const isActive = filter === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filterButton, isActive && styles.filterButtonActive]}
              onPress={() => setFilter(cat)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filtrer par ${cat}`}
            >
              <Text style={isActive ? styles.filterTextActive : styles.filterText}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#888" />
        ) : (
          <>
            {/* Une source injoignable ne doit pas masquer les autres résultats. */}
            {failedSources.length > 0 && !hasFailed && (
              <View style={styles.notice}>
                <Text style={styles.noticeText}>
                  Certaines données sont indisponibles ({failedSources.join(', ')}).
                </Text>
              </View>
            )}

            <FlatList
              data={filteredPlaces}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Brand.primary} />
              }
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyTitle}>
                    {hasFailed ? 'Impossible de charger les lieux' : 'Aucun lieu à afficher'}
                  </Text>
                  <Text style={styles.emptyText}>
                    {hasFailed
                      ? 'Vérifiez votre connexion internet, puis réessayez.'
                      : 'Essayez un autre filtre.'}
                  </Text>
                  {hasFailed && (
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={refresh}
                      accessibilityRole="button"
                      accessibilityLabel="Réessayer le chargement"
                    >
                      <Text style={styles.retryText}>Réessayer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
              renderItem={({ item }) => (
                <ListCard
                  title={item.title}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  tags={item.tags}
                  onPress={() => router.push({ pathname: '/places/[id]', params: { id: item.id } })}
                />
              )}
            />
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: HEADER_HEIGHT + 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Brand.muted,
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: Brand.primary,
  },
  filterText: {
    color: Brand.textPrimary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  notice: {
    backgroundColor: '#FFF4E5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  noticeText: {
    color: '#8A5300',
    fontSize: 13,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Brand.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Brand.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
