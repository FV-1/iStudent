import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Brand } from '@/constants/theme';
import { usePlaces } from '@/contexts/PlacesContext';

/**
 * Écran de détail d'un lieu.
 *
 * Il recevait auparavant une prop `place` qu'expo-router ne fournit jamais :
 * chaque ouverture depuis la liste plantait sur `place.imageUrl`.
 * Le lieu est désormais résolu depuis l'identifiant de la route.
 */
export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPlaceById, loading } = usePlaces();
  const router = useRouter();

  const place = id ? getPlaceById(id) : undefined;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Brand.primary} />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Lieu introuvable' }} />
        <Text style={styles.notFoundTitle}>Lieu introuvable</Text>
        <Text style={styles.notFoundText}>
          Ce lieu n’est plus disponible ou n’a pas pu être chargé.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Revenir à la liste"
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: place.title }} />

      {place.imageUrl ? (
        <Image source={{ uri: place.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>Image non disponible</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.category}>{place.category}</Text>
        <Text style={styles.description}>{place.description}</Text>

        {place.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {place.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Brand.surface,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Brand.primary,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 15,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: Brand.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 22,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: Brand.textSecondary,
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    color: Brand.primary,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: 'salmon',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: Brand.textPrimary,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Brand.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#fff',
    fontWeight: '600',
  },
});
