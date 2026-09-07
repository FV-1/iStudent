import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { motion, radius, spacing, useTheme } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/**
 * Pastille de filtre. La sélection est animée (couleur + léger rebond) et
 * confirmée par un retour haptique : les pastilles d'origine étaient
 * entièrement décoratives.
 */
export function Chip({ label, selected = false, onPress, accessibilityLabel }: ChipProps) {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(selected ? theme.colors.primary : theme.colors.surface, {
      duration: motion.fast,
    }),
    borderColor: withTiming(selected ? theme.colors.primary : theme.colors.border, {
      duration: motion.fast,
    }),
    transform: [{ scale: withSpring(selected ? 1.04 : 1, motion.spring) }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync().catch(() => {});
        }
        onPress?.();
      }}
      style={[styles.chip, theme.shadows.sm, animatedStyle]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text variant="label" tone={selected ? 'onPrimary' : 'secondary'} numberOfLines={1}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
