import evenements from '@/assets/data/evenements.json';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { ContentCard } from '@/components/ContentCard';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { EVENT_FILTERS, filterEvenements, type EventFilterKey } from '@/lib/eventFilters';
import { matchesQuery } from '@/lib/text';
import { spacing, useTheme } from '@/theme';

export default function ListeEvenements() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [filter, setFilter] = useState<EventFilterKey>('Tous');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const byTag = filterEvenements(evenements, filter);
    if (!search.trim()) {
      return byTag;
    }
    return byTag.filter((event) =>
      matchesQuery([event.title, event.descriptions, event.location, ...event.tags], search)
    );
  }, [filter, search]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        subtitle="Les sorties du moment"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Un concert, une expo, une soirée..."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {EVENT_FILTERS.map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            selected={filter === item.key}
            onPress={() => setFilter(item.key)}
            accessibilityLabel={`Filtrer par ${item.label}`}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
          filtered.length === 0 && styles.listEmpty,
        ]}
        ListHeaderComponent={
          filtered.length > 0 ? (
            <Text variant="label" tone="tertiary" style={styles.count}>
              {filtered.length} événement{filtered.length > 1 ? 's' : ''}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="sparkles-outline"
            title="Aucun événement"
            description={
              search
                ? `Rien ne correspond à « ${search} ».`
                : 'Essayez un autre filtre pour élargir la recherche.'
            }
          />
        }
        renderItem={({ item }) => (
          <ContentCard
            title={item.title}
            description={item.descriptions}
            imageUrl={item.image}
            tags={item.tags}
            badge={item.date}
            badgeIcon="calendar-outline"
            meta={item.location}
            metaIcon="location-outline"
            onPress={() =>
              router.push({ pathname: '/evenement/[id]', params: { id: String(item.id) } })
            }
          />
        )}
      />
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
  count: {
    marginBottom: spacing.md,
  },
});
