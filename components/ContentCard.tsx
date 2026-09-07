import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { motion, radius, spacing, useTheme } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FALLBACK_IMAGE = require('@/assets/images/hellfest.jpg');

/** Dégradé transparent -> sombre, pour garder le texte lisible sur l'image. */
const SCRIM = ['transparent', 'rgba(13,13,17,0.15)', 'rgba(13,13,17,0.78)'] as const;

type ContentCardProps = {
  title: string;
  description?: string;
  imageUrl?: string | null;
  tags?: string[];
  /** Pastille affichée en haut à gauche de l'image (catégorie, date...). */
  badge?: string;
  badgeIcon?: keyof typeof Ionicons.glyphMap;
  /** Ligne d'information secondaire sous le titre (lieu, adresse...). */
  meta?: string;
  metaIcon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

/**
 * Carte de contenu partagée par les listes de lieux et d'événements.
 *
 * `expo-image` remplace `Image` de React Native : fondu à l'apparition,
 * cache disque et mémoire, et pas de saut de mise en page au chargement.
 */
export function ContentCard({
  title,
  description,
  imageUrl,
  tags = [],
  badge,
  badgeIcon,
  meta,
  metaIcon,
  onPress,
}: ContentCardProps) {
  const theme = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.value * 0.02, motion.spring) }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPress?.();
      }}
      disabled={!onPress}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        theme.shadows.md,
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={imageUrl ? { uri: imageUrl } : FALLBACK_IMAGE}
          placeholder={{ blurhash: 'L6Pj0^i_.AyE_3t7t7R**0o#DgR4' }}
          contentFit="cover"
          transition={280}
          style={styles.image}
          accessibilityIgnoresInvertColors
        />

        <LinearGradient colors={SCRIM} style={StyleSheet.absoluteFill} pointerEvents="none" />

        {!!badge && (
          <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
            {!!badgeIcon && (
              <Ionicons name={badgeIcon} size={12} color={theme.colors.primary} />
            )}
            <Text variant="caption" tone="brand" numberOfLines={1}>
              {badge}
            </Text>
          </View>
        )}

        <View style={styles.imageFooter}>
          <Text variant="headline" style={styles.titleOnImage} numberOfLines={2}>
            {title}
          </Text>

          {!!meta && (
            <View style={styles.metaRow}>
              {!!metaIcon && <Ionicons name={metaIcon} size={12} color="rgba(255,255,255,0.85)" />}
              <Text variant="caption" style={styles.metaOnImage} numberOfLines={1}>
                {meta}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.body}>
        {!!description && (
          <Text variant="body" tone="secondary" numberOfLines={2}>
            {description}
          </Text>
        )}

        {tags.length > 0 && (
          <View style={styles.tagRow}>
            {tags.slice(0, 3).map((tag) => (
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
                <Text variant="caption" tone="brand" numberOfLines={1}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius['2xl'],
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  imageWrapper: {
    height: 178,
    justifyContent: 'flex-end',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    maxWidth: '70%',
  },
  imageFooter: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  titleOnImage: {
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaOnImage: {
    color: 'rgba(255,255,255,0.85)',
    flexShrink: 1,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
