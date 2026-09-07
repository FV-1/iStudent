import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/ui/SearchBar';
import { Text } from '@/components/ui/Text';
import { radius, spacing, useTheme } from '@/theme';

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  city?: string;
  onCityPress?: () => void;
  /** Affiche une barre de recherche sous le titre. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** `floating` superpose le header au contenu (au-dessus de la carte). */
  variant?: 'floating' | 'solid';
};

/**
 * Header commun aux écrans.
 *
 * Deux corrections structurelles par rapport à la version précédente :
 * - la hauteur suit les encoches via `useSafeAreaInsets` au lieu d'un
 *   `paddingTop: 40` codé en dur, faux sur la plupart des appareils ;
 * - en mode `floating`, le fond est un flou natif et non un aplat blanc.
 */
export function AppHeader({
  title = 'IStudent',
  subtitle,
  city = 'Nantes',
  onCityPress,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  variant = 'solid',
}: AppHeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const showSearch = typeof searchValue === 'string' && !!onSearchChange;
  const isFloating = variant === 'floating';

  const content = (
    <View style={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => router.push('/')}
          accessibilityRole="button"
          accessibilityLabel="IStudent, revenir à la carte"
          hitSlop={8}
        >
          <Text variant="title" tone="brand">
            {title}
          </Text>
          {!!subtitle && (
            <Text variant="caption" tone="secondary">
              {subtitle}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={onCityPress}
          disabled={!onCityPress}
          style={[
            styles.cityPill,
            {
              backgroundColor: theme.colors.primarySoft,
              borderColor: theme.colors.primaryBorder,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Ville sélectionnée : ${city}`}
        >
          <Ionicons name="location" size={13} color={theme.colors.primary} />
          <Text variant="label" tone="brand">
            {city}
          </Text>
        </Pressable>
      </View>

      {showSearch && (
        <View style={styles.searchRow}>
          <SearchBar
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </View>
      )}
    </View>
  );

  if (isFloating) {
    return (
      <View style={styles.floating}>
        {/* Le flou natif n'existe pas sur Android : on retombe sur un aplat. */}
        {Platform.OS === 'ios' ? (
          <BlurView intensity={64} tint={theme.colors.blurTint} style={styles.fill}>
            {content}
          </BlurView>
        ) : (
          <View style={[styles.fill, { backgroundColor: theme.colors.surface }]}>{content}</View>
        )}
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    borderBottomLeftRadius: radius['2xl'],
    borderBottomRightRadius: radius['2xl'],
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  searchRow: {
    marginTop: spacing.xs,
  },
});
