import type { ErrorBoundaryProps } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Brand } from '@/constants/theme';

/**
 * Filet de sécurité global : sans lui, la moindre exception de rendu
 * affiche un écran rouge en développement et un écran blanc en production.
 * expo-router récupère cet export depuis le layout racine.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Une erreur est survenue</Text>
      <Text style={styles.subtitle}>
        L’écran n’a pas pu s’afficher. Vous pouvez réessayer.
      </Text>

      <ScrollView style={styles.details}>
        <Text style={styles.message}>{error?.message ?? 'Erreur inconnue'}</Text>
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={retry}
        accessibilityRole="button"
        accessibilityLabel="Réessayer"
      >
        <Text style={styles.buttonText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: Brand.surface,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Brand.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Brand.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  details: {
    maxHeight: 160,
    marginBottom: 24,
  },
  message: {
    fontSize: 13,
    color: Brand.textMuted,
  },
  button: {
    backgroundColor: Brand.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
