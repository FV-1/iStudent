import EventContainer from '@/components/EventContainer';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

interface Library {
  nom: string;
  adresse: string;
  ville: string;
  [key: string]: any;
}

export default function TabTwoScreen() {
  const [libraries, setLibraries] = useState<Library[]>([]);

  useEffect(() => {
    fetch('https://data.loire-atlantique.fr/api/explore/v2.1/catalog/datasets/314549262_bibliotheques-et-mediatheques-en-loire-atlantique/records?select=nom%2C%20adresse%2C%20ville%2C%20latitude%2C%20longitude&limit=10&apikey=ee64875eab718b4e07f4f5de8db3c0474d96ce8ff920d3b26a33376c', {
      headers: {
        'Authorization': 'ee64875eab718b4e07f4f5de8db3c0474d96ce8ff920d3b26a33376c',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLibraries(data.results || []);
        console.log('Bibliothèques récupérées :', data.results);
      })
      .catch((error) => {
        console.error('Erreur API :', error);
      });
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gear.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Liste des bibliothèques</ThemedText>
      </ThemedView>
      <ThemedText>Voici quelques bibliothèques en Loire-Atlantique :</ThemedText>

      {libraries.map((library, index) => (
        <EventContainer
          key={index}
          title={library.nom || 'Nom non disponible'}
          description={library.adresse + ', ' + library.ville || 'Adresse non disponible'}
          imageUrl={library.imageUrl}
          tags={library.commune || []}
        />
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
