import { Ionicons } from '@expo/vector-icons';
import type { ErrorBoundaryProps } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { radius, spacing, useTheme } from '@/theme';

/**
 * Filet de sécurité global : sans lui, la moindre exception de rendu
 * affiche un écran rouge en développement et un écran blanc en production.
 * expo-router récupère cet export depuis le layout racine.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xl,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.dangerSoft }]}>
        <Ionicons name="alert-circle-outline" size={32} color={theme.colors.danger} />
      </View>

      <Text variant="title" align="center">
        Une erreur est survenue
      </Text>
      <Text variant="body" tone="secondary" align="center" style={styles.subtitle}>
        L’écran n’a pas pu s’afficher. Vous pouvez réessayer.
      </Text>

      <ScrollView
        style={[
          styles.details,
          { backgroundColor: theme.colors.surfaceSunken, borderColor: theme.colors.border },
        ]}
        contentContainerStyle={styles.detailsContent}
      >
        <Text variant="caption" tone="tertiary">
          {error?.message ?? 'Erreur inconnue'}
        </Text>
      </ScrollView>

      <Button label="Réessayer" onPress={retry} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  details: {
    maxHeight: 150,
    marginVertical: spacing['2xl'],
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  detailsContent: {
    padding: spacing.lg,
  },
  button: {
    alignSelf: 'stretch',
  },
});
