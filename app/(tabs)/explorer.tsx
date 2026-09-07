import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { ContentCard } from '@/components/ContentCard';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { usePlaces } from '@/contexts/PlacesContext';
import type { PlaceCategory } from '@/lib/places';
import { matchesQuery } from '@/lib/text';
import { spacing, useTheme } from '@/theme';

type Filter = 'Tous' | PlaceCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'Tous', label: 'Tous' },
  { key: 'Restaurant', label: '🍽 Restaurants' },
  { key: 'Bar', label: '🍸 Bars' },
  { key: 'Bibliothèque', label: '📚 Bibliothèques' },
];

const CATEGORY_ICON = {
  Restaurant: 'restaurant-outline',
  Bar: 'wine-outline',
  Bibliothèque: 'book-outline',
} as const;

export default function AllPlacesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { places, loading, failedSources, hasFailed, refresh } = usePlaces();

  const [filter, setFilter] = useState<Filter>('Tous');
  const [search, setSearch] = useState('');

  const filteredPlaces = useMemo(() => {
    const byCategory =
      filter === 'Tous' ? places : places.filter((place) => place.category === filter);

    if (!search.trim()) {
      return byCategory;
    }

    // Recherche insensible à la casse et aux accents, sur le nom, la
    // description et les tags.
    return byCategory.filter((place) =>
      matchesQuery([place.title, place.description, ...place.tags], search)
    );
  }, [places, filter, search]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        subtitle="Où aller aujourd'hui ?"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Un resto, un bar, une bibliothèque..."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            selected={filter === item.key}
            onPress={() => setFilter(item.key)}
            accessibilityLabel={`Filtrer par ${item.label}`}
          />
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.list}>
          {/* Silhouettes plutôt qu'un spinner : la page ne saute plus au
              moment où les données arrivent. */}
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 100 },
            filteredPlaces.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor={theme.colors.primary}
            />
          }
          ListHeaderComponent={
            failedSources.length > 0 && !hasFailed ? (
              <View
                style={[styles.notice, { backgroundColor: theme.colors.warningSoft }]}
              >
                <Text variant="caption" style={{ color: theme.colors.warning }}>
                  Certaines données sont indisponibles ({failedSources.join(', ')}).
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            hasFailed ? (
              <EmptyState
                icon="cloud-offline-outline"
                title="Impossible de charger les lieux"
                description="Vérifiez votre connexion internet, puis réessayez."
                actionLabel="Réessayer"
                onAction={refresh}
              />
            ) : (
              <EmptyState
                icon="search-outline"
                title="Aucun résultat"
                description={
                  search
                    ? `Rien ne correspond à « ${search} ».`
                    : 'Essayez un autre filtre.'
                }
              />
            )
          }
          renderItem={({ item }) => (
            <ContentCard
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              tags={item.tags}
              badge={item.category}
              badgeIcon={CATEGORY_ICON[item.category]}
              onPress={() => router.push({ pathname: '/places/[id]', params: { id: item.id } })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterScroll: {
    maxHeight: 56,
    marginBottom: spacing.sm,
  },
  filterContent: {
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  notice: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
});
