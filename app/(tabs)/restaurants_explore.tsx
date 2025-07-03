import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import EventContainer from '@/components/EventContainer';

interface Restaurant {
  nomoffre: string;
  description?: string; // optionnel, pas dans API mais tu peux gérer
  imageUrl?: string;    // optionnel, pas dans API
  tags?: string[];
  [key: string]: any;
}

export default function TabTwoScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    fetch('https://data.loire-atlantique.fr/api/explore/v2.1/catalog/datasets/793866443_restaurants-en-loire-atlantique/records?limit=10&offset=0&timezone=UTC&include_links=false&include_app_metas=false&apikey=ee64875eab718b4e07f4f5de8db3c0474d96ce8ff920d3b26a33376c', {
      headers: {
        'Authorization': 'ee64875eab718b4e07f4f5de8db3c0474d96ce8ff920d3b26a33376c',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Directement data.results, pas item.fields
        setRestaurants(data.results || []);
        console.log('Restaurants récupérés :', data.results);
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
        <ThemedText type="title">Liste des restaurants</ThemedText>
      </ThemedView>
      <ThemedText>Voici quelques restaurants en Loire-Atlantique :</ThemedText>

      {restaurants.map((restaurant, index) => (
        <EventContainer
          key={index}
          title={restaurant.nomoffre || 'Nom non disponible'}
          description={restaurant.type ? `${restaurant.type} - ${restaurant.categorie}` : 'Description non disponible'}
          imageUrl={restaurant.imageUrl} // Pas dans API, tu peux mettre null ou une image par défaut
          tags={restaurant.commune || []} // services comme tags
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
