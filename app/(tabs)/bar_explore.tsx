import EventContainer from '@/components/EventContainer';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

interface Bar {
  name: string;
  [key: string]: any;
}

export default function TabTwoScreen() {
  const [bars, setBars] = useState<Bar[]>([]);

  useEffect(() => {
  fetch('https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["name"="Nantes"]["admin_level"="8"]->.searchArea;(node["amenity"="bar"](area.searchArea);way["amenity"="bar"](area.searchArea);relation["amenity"="bar"](area.searchArea););out%20center;')
    .then((response) => response.json())
    .then((data) => {
      const barsList = data.elements.map((el: any) => ({
        id: el.id,
        name: el.tags?.name || 'Nom non disponible',
        street: el.tags?.['contact:street'] || el.tags?.['addr:street'] || 'Adresse non disponible',
      }));
      setBars(barsList);
      //console.log('Bars récupérés :', barsList);
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
          name="magnifyingglass"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Liste des Bars</ThemedText>
      </ThemedView>
      <ThemedText>Voici quelques bars en Loire-Atlantique :</ThemedText>

      {bars.map((bar) => (
      <EventContainer
        key={bar.id}
        title={bar.name}
        description={bar.street}
        tags={[]} // pas de tags pour le moment
      />
    ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#d52020ff',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
