import EventContainer from '@/components/EventContainer';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Place {
  id: string | number;
  title: string;
  description: string;
  category: 'Restaurant' | 'Bar' | 'Bibliothèque';
  tags?: string[];
  imageUrl?: string;
}

export default function AllPlacesScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filter, setFilter] = useState<'Tous' | 'Restaurant' | 'Bar' | 'Bibliothèque'>('Tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch(
        'https://data.loire-atlantique.fr/api/explore/v2.1/catalog/datasets/793866443_restaurants-en-loire-atlantique/records?limit=10&offset=0&timezone=UTC&include_links=false&include_app_metas=false&apikey=ee64875eab718b4e07f4f5de8db3c0474d96ce8ff920d3b26a33376c'
      );
      const data = await res.json();
      return data.results.map((r: any) => ({
        id: r.recordid || Math.random(),
        title: r.nomoffre || 'Nom non disponible',
        description: r.type ? `${r.type} - ${r.categorie}` : 'Description non disponible',
        category: 'Restaurant',
        tags: r.commune ? [r.commune] : [],
        imageUrl: r.imageUrl || undefined,
      }));
    };

    const fetchBars = async () => {
      const res = await fetch(
        'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["name"="Nantes"]["admin_level"="8"]->.searchArea;(node["amenity"="bar"](area.searchArea);way["amenity"="bar"](area.searchArea);relation["amenity"="bar"](area.searchArea););out%20center;'
      );
      const data = await res.json();
      return data.elements.map((b: any) => ({
        id: b.id,
        title: b.tags?.name || 'Nom non disponible',
        description:
          b.tags?.['contact:street'] || b.tags?.['addr:street'] || 'Adresse non disponible',
        category: 'Bar',
        tags: [],
      }));
    };

    const fetchLibraries = async () => {
      const res = await fetch(
        'https://data.loire-atlantique.fr/api/explore/v2.1/catalog/datasets/314549262_bibliotheques-et-mediatheques-en-loire-atlantique/records?select=nom%2C%20adresse%2C%20ville%2C%20latitude%2C%20longitude&limit=10&apikey=ee64875eab718b4e07f4f5de8db3c0474d96ce8ff920d3b26a33376c'
      );
      const data = await res.json();
      return data.results.map((l: any) => ({
        id: l.recordid || Math.random(),
        title: l.nom || 'Nom non disponible',
        description: `${l.adresse}, ${l.ville}`,
        category: 'Bibliothèque',
        tags: l.commune ? [l.commune] : [],
        imageUrl: l.imageUrl || undefined,
      }));
    };

    Promise.all([fetchRestaurants(), fetchBars(), fetchLibraries()])
      .then(([restos, bars, libs]) => {
        setPlaces([...restos, ...bars, ...libs]);
      })
      .catch((err) => console.error('Erreur lors de la récupération des données :', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPlaces =
    filter === 'Tous' ? places : places.filter((place) => place.category === filter);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="map.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explorer</ThemedText>
      </ThemedView>

      <View style={styles.filterContainer}>
        {(['Tous', 'Restaurant', 'Bar', 'Bibliothèque'] as const).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              filter === cat && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(cat)}
          >
            <ThemedText style={filter === cat ? styles.filterTextActive : styles.filterText}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#888" />
      ) : (
        filteredPlaces.map((place) => (
          <EventContainer
            key={place.id}
            title={place.title}
            description={place.description}
            imageUrl={place.imageUrl}
            tags={place.tags}
          />
        ))
      )}
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
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#ccc',
    margin: 4,
  },
  filterButtonActive: {
    backgroundColor: 'salmon',
  },
  filterText: {
    color: '#333',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});