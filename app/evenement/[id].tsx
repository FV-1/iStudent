import evenements from '@/assets/data/evenements.json';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

const FALLBACK_IMAGE = require('../../assets/images/hellfest.jpg');

export default function FullEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = evenements.find((e) => e.id === Number(id));

  const openLink = useCallback(async () => {
    if (!event?.link) {
      return;
    }
    try {
      const supported = await Linking.canOpenURL(event.link);
      if (!supported) {
        Alert.alert('Lien indisponible', 'Ce lien ne peut pas être ouvert sur cet appareil.');
        return;
      }
      await Linking.openURL(event.link);
    } catch (error) {
      // openURL rejette si aucune application ne peut traiter l'URL.
      console.warn('Ouverture du lien impossible :', error);
      Alert.alert('Lien indisponible', 'Impossible d’ouvrir ce lien pour le moment.');
    }
  }, [event?.link]);

  if (!event) {
    return (
      <View style={styles.notFound}>
        <Stack.Screen options={{ title: 'Événement introuvable' }} />
        <Text style={styles.notFoundText}>Événement non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* `Stack.Screen` remplace le useLayoutEffect + useNavigation :
          le titre est déclaré au rendu, sans effet de bord. */}
      <Stack.Screen options={{ title: event.title }} />

      <Image
        source={event.image ? { uri: event.image } : FALLBACK_IMAGE}
        style={styles.image}
      />

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.location}>{event.location}</Text>

      <View style={styles.tagsContainer}>
        {event.tags?.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.description}>{event.descriptions}</Text>

      {!!event.link && (
        <Pressable
          style={styles.button}
          onPress={openLink}
          accessibilityRole="button"
          accessibilityLabel={`Ouvrir la page de l’événement ${event.title}`}
        >
          <Text style={styles.buttonText}>J&apos;y vais !</Text>
        </Pressable>
      )}
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
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: Brand.textSecondary,
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
    color: '#555',
    marginBottom: 4,
    textAlign: 'center',
  },
  location: {
    fontSize: 15,
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
    backgroundColor: Brand.primaryDark,
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
    color: '#444',
    lineHeight: 24,
    marginBottom: 36,
    textAlign: 'justify',
  },
  button: {
    backgroundColor: Brand.primaryDark,
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
