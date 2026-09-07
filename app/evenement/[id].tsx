import evenements from '@/assets/data/evenements.json';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';

import { DetailScreenLayout } from '@/components/DetailScreenLayout';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { radius, spacing, useTheme } from '@/theme';

const FALLBACK_IMAGE = require('@/assets/images/hellfest.jpg');

export default function FullEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const event = evenements.find((e) => e.id === Number(id));

  const openLink = useCallback(async () => {
    if (!event?.link) {
      return;
    }
    try {
      const supported = await Linking.canOpenURL(event.link);
      if (!supported) {
        Alert.alert('Lien indisponible', 'Ce lien ne peut pas être ouvert sur cet appareil.');
        return;
      }
      await Linking.openURL(event.link);
    } catch (error) {
      console.warn('Ouverture du lien impossible :', error);
      Alert.alert('Lien indisponible', 'Impossible d’ouvrir ce lien pour le moment.');
    }
  }, [event?.link]);

  if (!event) {
    return (
      <View style={[styles.notFound, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          icon="calendar-outline"
          title="Événement introuvable"
          description="Cet événement n’existe plus ou a été retiré du programme."
        />
      </View>
    );
  }

  return (
    <DetailScreenLayout
      imageUrl={event.image}
      fallbackImage={FALLBACK_IMAGE}
      heroOverlay={
        <>
          <Text variant="display" style={styles.heroTitle}>
            {event.title}
          </Text>
          <View style={styles.heroMeta}>
            <Ionicons name="location" size={14} color="rgba(255,255,255,0.9)" />
            <Text variant="label" style={styles.heroMetaText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        </>
      }
      footer={
        event.link ? (
          <Button
            label="J’y vais !"
            onPress={openLink}
            accessibilityLabel={`Ouvrir la page de l’événement ${event.title}`}
          />
        ) : undefined
      }
    >
      <View style={[styles.dateCard, { backgroundColor: theme.colors.primarySoft }]}>
        <Ionicons name="calendar" size={18} color={theme.colors.primary} />
        <Text variant="bodyStrong" tone="brand" style={styles.dateText}>
          {event.date}
        </Text>
      </View>

      {event.tags.length > 0 && (
        <View style={styles.tagRow}>
          {event.tags.map((tag) => (
            <View
              key={tag}
              style={[
                styles.tag,
                {
                  backgroundColor: theme.colors.surfaceSunken,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text variant="caption" tone="secondary">
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text variant="headline">À propos</Text>
        <Text variant="body" tone="secondary" style={styles.description}>
          {event.descriptions}
        </Text>
      </View>
    </DetailScreenLayout>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    color: '#FFFFFF',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroMetaText: {
    color: 'rgba(255,255,255,0.9)',
    flexShrink: 1,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
  },
  dateText: {
    flexShrink: 1,
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
  section: {
    gap: spacing.sm,
  },
  description: {
    lineHeight: 24,
  },
});
