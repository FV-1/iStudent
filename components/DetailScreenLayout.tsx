import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui/IconButton';
import { radius, spacing, useTheme } from '@/theme';

const HERO_HEIGHT = 320;
const SCRIM = ['transparent', 'rgba(13,13,17,0.2)', 'rgba(13,13,17,0.75)'] as const;

type DetailScreenLayoutProps = {
  imageUrl?: string | null;
  fallbackImage: number;
  children: ReactNode;
  /** Contenu superposé en bas de l'image (titre, date, lieu...). */
  heroOverlay?: ReactNode;
  /** Barre d'action collée en bas de l'écran. */
  footer?: ReactNode;
};

/**
 * Gabarit des écrans de détail : image héro en parallaxe, bouton retour
 * flottant et barre d'action fixe.
 *
 * Les deux écrans de détail répétaient auparavant leur propre mise en page
 * avec une image statique et aucun moyen de revenir en arrière hors du
 * header système.
 */
export function DetailScreenLayout({
  imageUrl,
  fallbackImage,
  children,
  heroOverlay,
  footer,
}: DetailScreenLayoutProps) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // L'image se dilate au sur-défilement vers le haut et défile deux fois
  // moins vite que le contenu : effet de profondeur.
  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [-HERO_HEIGHT, 0, HERO_HEIGHT], [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.5]),
      },
      {
        scale: interpolate(scrollY.value, [-HERO_HEIGHT, 0], [2.2, 1], 'clamp'),
      },
    ],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.hero, heroStyle]}>
        <Image
          source={imageUrl ? { uri: imageUrl } : fallbackImage}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
          accessibilityIgnoresInvertColors
        />
        <LinearGradient colors={SCRIM} style={StyleSheet.absoluteFill} />
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (footer ? 120 : spacing['4xl']) }}
      >
        <View style={styles.heroSpacer}>{!!heroOverlay && <View style={styles.heroOverlay}>{heroOverlay}</View>}</View>

        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {children}
        </View>
      </Animated.ScrollView>

      <View style={[styles.backButton, { top: insets.top + spacing.sm }]}>
        <IconButton
          name="chevron-back"
          onPress={() => router.back()}
          accessibilityLabel="Revenir en arrière"
        />
      </View>

      {!!footer && (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + spacing.lg,
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
  },
  heroSpacer: {
    height: HERO_HEIGHT,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    padding: spacing.xl,
    paddingBottom: spacing['2xl'],
    gap: spacing.xs,
  },
  sheet: {
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
    marginTop: -spacing.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    minHeight: 320,
  },
  backButton: {
    position: 'absolute',
    left: spacing.xl,
    zIndex: 20,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
  },
});
