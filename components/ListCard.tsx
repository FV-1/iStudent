import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Brand } from '@/constants/theme';

const FALLBACK_IMAGE = require('@/assets/images/hellfest.jpg');

type ListCardProps = {
  title: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  onPress?: () => void;
};

/**
 * Carte de liste partagée entre l'onglet Explorer et l'onglet Événements,
 * qui en dupliquaient chacun leur propre copie avec des styles identiques.
 */
export function ListCard({ title, description, imageUrl, tags = [], onPress }: ListCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      <Image
        source={imageUrl ? { uri: imageUrl } : FALLBACK_IMAGE}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {!!description && (
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        )}
        {tags.length > 0 && (
          <View style={styles.tagRow}>
            {/* `slice` avant `map` : afficher un nombre fixe de capsules
                produisait des "#undefined" quand il y avait moins de 3 tags. */}
            {tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tagCapsule}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Brand.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: Brand.textSecondary,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagCapsule: {
    backgroundColor: Brand.primary,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
