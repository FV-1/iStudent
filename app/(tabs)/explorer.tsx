import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

interface Place {
  id: string | number;
  title: string;
  description: string;
  category: 'Restaurant' | 'Bar' | 'Bibliothèque';
  tags?: string[];
  imageUrl?: string;
}

export default function AllPlacesScreen() {
  const router = useRouter();
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
        'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3Barea%5B%22name%22%3D%22Nantes%22%5D%5B%22admin_level%22%3D%228%22%5D-%3E.searchArea%3B(%0Anode%5B%22amenity%22%3D%22bar%22%5D(area.searchArea)%3B%0Away%5B%22amenity%22%3D%22bar%22%5D(area.searchArea)%3B%0Arelation%5B%22amenity%22%3D%22bar%22%5D(area.searchArea)%3B%0A)%3Bout%20center%2010%3B'
      );
      const data = await res.json();
      return data.elements.map((b: any) => ({
        id: b.id,
        title: b.tags?.name || 'Nom non disponible',
        description: b.tags?.['contact:street'] || b.tags?.['addr:street'] || 'Adresse non disponible',
        category: 'Bar',
        tags: [],
        imageUrl: undefined,
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
        imageUrl: undefined,
      }));
    };

    Promise.all([fetchRestaurants(), fetchBars(), fetchLibraries()])
      .then(([restos, bars, libs]) => {
        setPlaces([...restos, ...bars, ...libs]);
      })
      .catch((err) => console.error('Erreur lors de la récupération des données :', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPlaces = filter === 'Tous' ? places : places.filter((p) => p.category === filter);

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.whiteZoneHaut}>
        <View style={styles.topComponents}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={{ fontSize: 30, color: '#FF6666', fontWeight: 'bold' }}>IStudent</Text>
          </TouchableOpacity>
          <Ionicons name="search" size={20} color="grey" />
          <TouchableOpacity style={styles.bigButton}>
            <Text style={styles.buttonText}>Nantes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FILTRE */}
      <View style={styles.filterContainer}>
        {(['Tous', 'Restaurant', 'Bar', 'Bibliothèque'] as const).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterButton, filter === cat && styles.filterButtonActive]}
            onPress={() => setFilter(cat)}
          >
            <Text style={filter === cat ? styles.filterTextActive : styles.filterText}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTE */}
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#888" />
        ) : (
          <FlatList
            data={filteredPlaces}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: '/places/[id]',
                    params: { id: item.id.toString() },
                  })
                }
              >
                <Image
                  source={
                    item.imageUrl
                      ? { uri: item.imageUrl }
                      : require('@/assets/images/hellfest.jpg')
                  }
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={3}>
                    {item.description}
                  </Text>
                  <View style={styles.tagRow}>
                    {item.tags?.slice(0, 3).map((tag, i) => (
                      <View key={i} style={styles.tagCapsule}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  whiteZoneHaut: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  topComponents: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    height: 80,
  },
  bigButton: {
    borderWidth: 2,
    borderColor: '#FF6666',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#FF6666',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 100,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: '#FF6666',
  },
  filterText: {
    color: '#333',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagCapsule: {
    backgroundColor: '#FF6666',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
});
