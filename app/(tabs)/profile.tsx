import evenements from '@/assets/data/evenements.json';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui/IconButton';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { palette, radius, spacing, useTheme } from '@/theme';

/**
 * Les avatars pointaient sur des URLs signées Facebook/Instagram dont les
 * jetons ont expiré en août 2025 : toutes les images étaient cassées.
 * Les portraits correspondants étaient déjà présents dans assets/images.
 */
const FRIENDS = [
  { username: '@enzo_romoli', image: require('@/assets/images/enzo.jpg'), online: true },
  { username: '@hafsa_rak', image: require('@/assets/images/hafsa.jpg'), online: false },
  { username: '@martin_rngx', image: require('@/assets/images/martin.jpg'), online: false },
  { username: '@elsattaquent', image: require('@/assets/images/elsa.jpg'), online: true },
];

const UPCOMING_EVENTS = evenements.slice(0, 4);

const STATS = [
  { label: 'Sorties', value: '12' },
  { label: 'Amis', value: String(FRIENDS.length) },
  { label: 'Favoris', value: '8' },
];

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* En-tête dégradé : donne un point d'ancrage visuel fort et remplace
          la barre blanche générique répétée sur tous les écrans. */}
      <LinearGradient
        colors={[palette.coral[400], palette.coral[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}
      >
        <View style={styles.heroActions}>
          <IconButton name="settings-outline" accessibilityLabel="Réglages" variant="ghost" />
          <IconButton name="heart-outline" accessibilityLabel="Favoris" variant="ghost" />
        </View>

        <Image
          source={require('@/assets/images/image-profil2.jpg')}
          style={styles.avatar}
          contentFit="cover"
          transition={240}
          accessibilityLabel="Votre photo de profil"
        />

        <Text variant="title" style={styles.heroName}>
          Victor
        </Text>
        <Text variant="label" style={styles.heroHandle}>
          @victor_flc
        </Text>

        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text variant="headline" style={styles.statValue}>
                {stat.value}
              </Text>
              <Text variant="caption" style={styles.statLabel}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <Surface padded radius="2xl" elevation="sm" style={styles.block}>
          <View style={styles.blockHeader}>
            <Text variant="headline">StudFriends</Text>
            <Text variant="caption" tone="tertiary">
              {FRIENDS.filter((f) => f.online).length} en ville
            </Text>
          </View>

          <View style={styles.friendsList}>
            {FRIENDS.map((friend) => (
              <View key={friend.username} style={styles.friend}>
                <View>
                  <Image
                    source={friend.image}
                    style={[styles.friendAvatar, { borderColor: theme.colors.surface }]}
                    contentFit="cover"
                    transition={200}
                    accessibilityLabel={`Photo de ${friend.username}`}
                  />
                  {friend.online && (
                    <View
                      style={[
                        styles.onlineDot,
                        {
                          backgroundColor: theme.colors.success,
                          borderColor: theme.colors.surface,
                        },
                      ]}
                    />
                  )}
                </View>
                <Text variant="caption" tone="secondary" numberOfLines={1} style={styles.friendName}>
                  {friend.username.replace('@', '')}
                </Text>
              </View>
            ))}
          </View>
        </Surface>

        <Surface padded radius="2xl" elevation="sm" style={styles.block}>
          <View style={styles.blockHeader}>
            <Text variant="headline">Événements à venir</Text>
          </View>

          {UPCOMING_EVENTS.map((event, index) => (
            <Pressable
              key={event.id}
              onPress={() =>
                router.push({ pathname: '/evenement/[id]', params: { id: String(event.id) } })
              }
              style={[
                styles.eventRow,
                index < UPCOMING_EVENTS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Événement ${event.title}`}
            >
              <Image
                source={{ uri: event.image }}
                style={styles.eventThumb}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.eventText}>
                <Text variant="bodyStrong" numberOfLines={1}>
                  {event.title}
                </Text>
                <Text variant="caption" tone="tertiary" numberOfLines={1}>
                  {event.date}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
            </Pressable>
          ))}
        </Surface>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingBottom: spacing['3xl'],
    borderBottomLeftRadius: radius['3xl'],
    borderBottomRightRadius: radius['3xl'],
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  heroName: {
    color: '#FFFFFF',
    marginTop: spacing.md,
  },
  heroHandle: {
    color: 'rgba(255,255,255,0.85)',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing['3xl'],
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
  },
  body: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  block: {
    gap: spacing.lg,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  friend: {
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: 72,
  },
  friendAvatar: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    borderWidth: 2,
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: radius.pill,
    borderWidth: 2,
  },
  friendName: {
    textAlign: 'center',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  eventThumb: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
  },
  eventText: {
    flex: 1,
    gap: 2,
  },
});
