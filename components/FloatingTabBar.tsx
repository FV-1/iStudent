import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { motion, radius, spacing, useTheme } from '@/theme';

const AVATAR = require('@/assets/images/image-profil2.jpg');

const TAB_META: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  index: { icon: 'map-outline', activeIcon: 'map', label: 'Carte' },
  explorer: { icon: 'compass-outline', activeIcon: 'compass', label: 'Explorer' },
  restaurants_explore: { icon: 'sparkles-outline', activeIcon: 'sparkles', label: 'Événements' },
  profile: { icon: 'person-outline', activeIcon: 'person', label: 'Profil' },
};

/**
 * Barre d'onglets flottante avec indicateur glissant.
 *
 * Remplace la barre par défaut, dont le style d'origine posait `left`/`right`
 * sans `position: 'absolute'` (donc sans effet) et ignorait la zone sûre du
 * bas, si bien que la barre chevauchait la barre gestuelle.
 */
export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);

  const tabCount = state.routes.length;
  const tabWidth = width / tabCount;

  // L'indicateur suit l'onglet actif en ressort plutôt que de sauter.
  const translateX = useDerivedValue(() =>
    withSpring(state.index * tabWidth, motion.spring)
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: tabWidth,
    opacity: withTiming(width > 0 ? 1 : 0, { duration: motion.fast }),
  }));

  const bar = (
    <View
      style={styles.inner}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <Animated.View style={[styles.indicatorTrack, indicatorStyle]} pointerEvents="none">
        <View style={[styles.indicator, { backgroundColor: theme.colors.primarySoft }]} />
      </Animated.View>

      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TAB_META[route.name];
        if (!meta) {
          return null;
        }

        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={meta.label}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.selectionAsync().catch(() => {});
              }
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
          >
            {route.name === 'profile' ? (
              <Image
                source={AVATAR}
                style={[
                  styles.avatar,
                  {
                    borderColor: focused ? theme.colors.primary : 'transparent',
                  },
                ]}
                contentFit="cover"
              />
            ) : (
              <Ionicons
                name={focused ? meta.activeIcon : meta.icon}
                size={22}
                color={focused ? theme.colors.primary : theme.colors.textTertiary}
              />
            )}

            <Text
              variant="caption"
              tone={focused ? 'brand' : 'tertiary'}
              numberOfLines={1}
              style={styles.label}
            >
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        // `insets.bottom` évite le chevauchement avec la barre gestuelle.
        { bottom: Math.max(insets.bottom, spacing.md) },
        theme.shadows.lg,
      ]}
    >
      <View style={[styles.clip, { borderColor: theme.colors.border }]}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={72} tint={theme.colors.blurTint} style={styles.fill}>
            {bar}
          </BlurView>
        ) : (
          <View style={[styles.fill, { backgroundColor: theme.colors.surface }]}>{bar}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
  },
  clip: {
    borderRadius: radius['2xl'],
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
  },
  indicatorTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 58,
    height: 46,
    borderRadius: radius.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
  },
  label: {
    fontSize: 10,
  },
});
