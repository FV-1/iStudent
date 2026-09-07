import evenements from '@/assets/data/evenements.json';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { AppHeader } from '@/components/AppHeader';
import {
  EVENT_FILTERS,
  filterEvenements,
  getEventCoordinates,
  type Evenement,
  type EventFilterKey,
} from '@/lib/eventFilters';
import styles from '../style/index';

const FALLBACK_IMAGE = require('../../assets/images/hellfest.jpg');

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [visible, setVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<EventFilterKey>('Tous');
  const [locationGranted, setLocationGranted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // `showsUserLocation` déclenche une demande d'autorisation native : sans
    // cette requête explicite la position n'est jamais accordée sur Android,
    // et iOS refuse d'afficher la position de l'utilisateur.
    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!cancelled) {
          setLocationGranted(status === Location.PermissionStatus.GRANTED);
        }
      } catch (error) {
        console.warn('Permission de localisation indisponible :', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleEvents = useMemo(
    () => filterEvenements(evenements, activeFilter),
    [activeFilter]
  );

  // Si l'événement sélectionné sort du filtre courant, on referme sa fiche.
  useEffect(() => {
    if (selectedEvent && !visibleEvents.some((e) => e.id === selectedEvent.id)) {
      setVisible(false);
      setSelectedEvent(null);
    }
  }, [visibleEvents, selectedEvent]);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={locationGranted}
        initialRegion={{
          latitude: 47.228166,
          longitude: -1.5634918,
          latitudeDelta: 0.002,
          longitudeDelta: 0.0421,
        }}
        onPress={() => setVisible(false)}
      >
        {visibleEvents.map((evenement) => {
          const coordinates = getEventCoordinates(evenement);
          if (!coordinates) {
            return null;
          }

          return (
            <Marker
              key={evenement.id}
              coordinate={coordinates}
              image={require('../../assets/images/pointBorzoi.png')}
              title={evenement.title}
              onPress={() => {
                setSelectedEvent(evenement);
                setVisible(true);
              }}
            />
          );
        })}
      </MapView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtreScroll}
        contentContainerStyle={styles.filtreContent}
      >
        {EVENT_FILTERS.map((filter) => {
          const isActive = filter.key === activeFilter;
          return (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filtreCapsule, isActive && styles.filtreCapsuleActive]}
              onPress={() => setActiveFilter(filter.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filtrer par ${filter.label}`}
            >
              <Text style={[styles.filtreText, isActive && styles.filtreTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {visible && selectedEvent && (
        <TouchableWithoutFeedback
          onPress={() =>
            router.push({
              pathname: '/evenement/[id]',
              params: { id: String(selectedEvent.id) },
            })
          }
        >
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={selectedEvent.image ? { uri: selectedEvent.image } : FALLBACK_IMAGE}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.cardTitle}>{selectedEvent.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={3} ellipsizeMode="tail">
                  {selectedEvent.descriptions}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'center',
              }}
            >
              {/* Trois capsules étaient affichées en dur : les événements
                  ayant moins de 3 tags affichaient "#undefined". */}
              {selectedEvent.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tagCapsule}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      <AppHeader />
    </SafeAreaView>
  );
}
