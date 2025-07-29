import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

interface PlaceDetailProps {
  place: {
    title: string;
    description: string;
    imageUrl?: string;
    tags?: string[];
    category: string;
  };
}

export default function PlaceDetailScreen({ place }: PlaceDetailProps) {
  return (
    <ScrollView style={styles.container}>
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
        <View style={styles.tagsContainer}>
          {place.tags && place.tags.length > 0
            ? place.tags.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))
            : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#666',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#FF6666',
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
    color: '#333',
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FF6666',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontWeight: '600',
  },
});
