import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

type EventContainerProps = {
  title?: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
};

export default function EventContainer({
  title = "Evenement non défini",
  description = "Aucune description disponible pour cet événement.",
  imageUrl,
  tags = [],
}: EventContainerProps) {
  return (
    <ThemedView style={styles.page}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.eventCard}>
          <Image
            source={imageUrl ? { uri: imageUrl } : require('../assets/images/musique.png')}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            <View style={styles.tagContainer}>
              {tags.length === 0 ? (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Gratuit</Text>
                </View>
              ) : (
                tags.map((tag, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16,
    backgroundColor: '#green',
  },
  scroll: {
    flex: 1,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#ddd',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#FF6666',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
});
