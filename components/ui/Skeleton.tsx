import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { radius as radiusTokens, spacing, useTheme } from '@/theme';

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: keyof typeof radiusTokens;
  style?: ViewStyle;
};

/** Bloc de chargement avec pulsation. */
export function Skeleton({ width = '100%', height = 16, radius = 'md', style }: SkeletonProps) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: 0.45 + progress.value * 0.4 }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radiusTokens[radius],
          backgroundColor: theme.colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/**
 * Silhouette d'une carte de liste. Remplace le spinner centré : l'utilisateur
 * voit immédiatement la forme du contenu à venir.
 */
export function SkeletonCard() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <Skeleton height={148} radius="lg" />
      <View style={styles.body}>
        <Skeleton width="70%" height={18} />
        <Skeleton width="90%" height={13} style={{ marginTop: spacing.sm }} />
        <View style={styles.chips}>
          <Skeleton width={72} height={24} radius="pill" />
          <Skeleton width={54} height={24} radius="pill" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radiusTokens['2xl'],
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  body: {
    padding: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
