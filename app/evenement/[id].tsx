import evenements from '@/assets/data/evenements.json';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FullEventScreen() {
  const { id } = useLocalSearchParams();
  const event = evenements.find((e) => e.id === Number(id));

  if (!event) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Événement non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={event.image ? { uri: event.image } : require('../../assets/images/hellfest.jpg')}
        style={styles.image}
      />

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.location}>{event.location}</Text>

      <View style={styles.tagsContainer}>
        {event.tags?.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.description}>{event.descriptions}</Text>

      <TouchableOpacity style={styles.button} onPress={() => console.log("Inscription")}>
        <Text style={styles.buttonText}>J'y vais !</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
    lineHeight: 32,
    textAlign: 'center',
  },
  date: {
    fontSize: 15,
    fontWeight: '400',
    color: '#555',
    marginBottom: 4,
    textAlign: 'center',
  },
  location: {
    fontSize: 15,
    fontWeight: '400',
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#FF5A5F',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#444',
    lineHeight: 24,
    marginBottom: 36,
    textAlign: 'justify',
  },
  button: {
    backgroundColor: '#FF5A5F',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
