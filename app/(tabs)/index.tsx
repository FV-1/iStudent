import evenements from '@/assets/data/evenements.json';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../style/index';

type Evenement = typeof evenements[number];

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: 47.228166,
          longitude: -1.5634918,
          latitudeDelta: 0.002,
          longitudeDelta: 0.0421,
        }}
        onPress={() => setVisible(false)}
      >
        {evenements.map((evenement) => {
          const lat = parseFloat(evenement.coordinates?.[0]?.[0] ?? '0');
          const lon = parseFloat(evenement.coordinates?.[0]?.[1] ?? '0');

          if (!lat || !lon) {
            console.warn('Coordonnées manquantes pour :', evenement.title);
            return null;
          }

          return (
            <Marker
              key={evenement.id}
              coordinate={{ latitude: lat, longitude: lon }}
              image={require('../../assets/images/pointBorzoi.png')}
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
        {['🎉 Event', '🍽 Resto', '🎶 Concert', '🏛️ Culture', '🌳 Nature'].map((item, index) => (
          <TouchableOpacity key={index} style={styles.filtreCapsule}>
            <Text style={styles.filtreText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {visible && selectedEvent && (
        <TouchableWithoutFeedback
          onPress={() => {
            if (selectedEvent?.id) {
              router.push({
                pathname: '/evenement/[id]',
                params: { id: selectedEvent.id.toString() },
              });
            }
          }}
        >
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={
                  selectedEvent?.image
                    ? { uri: selectedEvent.image }
                    : require('../../assets/images/hellfest.jpg')
                }
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.cardTitle}>
                  {selectedEvent ? selectedEvent.title : 'Hellfest'}
                </Text>
                <Text
                  style={styles.cardDescription}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {selectedEvent?.descriptions}
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
              <View style={styles.tagCapsule}>
                <Text style={styles.tagText}>#{selectedEvent?.tags[0]}</Text>
              </View>
              <View style={styles.tagCapsule}>
                <Text style={styles.tagText}>#{selectedEvent?.tags[1]}</Text>
              </View>
              <View style={styles.tagCapsule}>
                <Text style={styles.tagText}>#{selectedEvent?.tags[2]}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.whiteZoneHaut}>
        <View style={styles.topComponents}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={{ fontSize: 30, color: '#FF6666', fontWeight: 'bold' }}>IStuud</Text>
          </TouchableOpacity>
          <Icon name="search" size={20} color="grey" />
          <TouchableOpacity style={styles.bigButton}>
            <Text style={styles.buttonText}>Nantes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
