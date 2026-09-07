import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { motion, radius, useTheme } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type IconButtonProps = {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  /** Obligatoire : ces boutons n'ont aucun texte visible. */
  accessibilityLabel: string;
  size?: number;
  variant?: 'surface' | 'ghost' | 'primary';
};

/** Bouton icône circulaire, avec compression au doigt et retour haptique. */
export function IconButton({
  name,
  onPress,
  accessibilityLabel,
  size = 20,
  variant = 'surface',
}: IconButtonProps) {
  const theme = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.value * 0.08, motion.spring) }],
  }));

  const background =
    variant === 'surface'
      ? theme.colors.surface
      : variant === 'primary'
        ? theme.colors.primary
        : 'transparent';

  const iconColor =
    variant === 'primary' ? theme.colors.textOnPrimary : theme.colors.textSecondary;

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
          Haptics.selectionAsync().catch(() => {});
        }
        onPress?.();
      }}
      style={[
        styles.button,
        { backgroundColor: background },
        variant === 'surface' && {
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
    >
      <Ionicons name={name} size={size} color={iconColor} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
