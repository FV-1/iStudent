import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { DetailScreenLayout } from '@/components/DetailScreenLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { usePlaces } from '@/contexts/PlacesContext';
import { radius, spacing, useTheme } from '@/theme';

const FALLBACK_IMAGE = require('@/assets/images/hellfest.jpg');

const CATEGORY_ICON = {
  Restaurant: 'restaurant',
  Bar: 'wine',
  Bibliothèque: 'book',
} as const;

/**
 * Écran de détail d'un lieu.
 *
 * Il recevait auparavant une prop `place` qu'expo-router ne fournit jamais :
 * chaque ouverture depuis la liste plantait sur `place.imageUrl`.
 * Le lieu est désormais résolu depuis l'identifiant de la route.
 */
export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlaceById, loading } = usePlaces();
  const router = useRouter();
  const theme = useTheme();

  const place = id ? getPlaceById(id) : undefined;

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          icon="map-outline"
          title="Lieu introuvable"
          description="Ce lieu n’est plus disponible ou n’a pas pu être chargé."
          actionLabel="Retour"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const hasCoordinates = place.latitude !== undefined && place.longitude !== undefined;

  return (
    <DetailScreenLayout
      imageUrl={place.imageUrl}
      fallbackImage={FALLBACK_IMAGE}
      heroOverlay={
        <>
          <View style={styles.categoryPill}>
            <Ionicons name={CATEGORY_ICON[place.category]} size={13} color="#FFFFFF" />
            <Text variant="caption" style={styles.categoryText}>
              {place.category}
            </Text>
          </View>
          <Text variant="display" style={styles.heroTitle}>
            {place.title}
          </Text>
        </>
      }
    >
      <View style={styles.section}>
        <Text variant="headline">Informations</Text>
        <View style={[styles.infoRow, { borderColor: theme.colors.border }]}>
          <Ionicons name="location-outline" size={18} color={theme.colors.primary} />
          <Text variant="body" tone="secondary" style={styles.infoText}>
            {place.description}
          </Text>
        </View>

        {hasCoordinates && (
          <View style={[styles.infoRow, { borderColor: theme.colors.border }]}>
            <Ionicons name="navigate-outline" size={18} color={theme.colors.primary} />
            <Text variant="body" tone="secondary" style={styles.infoText}>
              {place.latitude?.toFixed(4)}, {place.longitude?.toFixed(4)}
            </Text>
          </View>
        )}
      </View>

      {place.tags.length > 0 && (
        <View style={styles.section}>
          <Text variant="headline">Situé à</Text>
          <View style={styles.tagRow}>
            {place.tags.map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  {
                    backgroundColor: theme.colors.primarySoft,
                    borderColor: theme.colors.primaryBorder,
                  },
                ]}
              >
                <Text variant="caption" tone="brand">
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </DetailScreenLayout>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  categoryText: {
    color: '#FFFFFF',
  },
  heroTitle: {
    color: '#FFFFFF',
  },
  section: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  infoText: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
