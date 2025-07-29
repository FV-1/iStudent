import evenements from '@/assets/data/evenements.json';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ListeEvenements() {
  const router = useRouter();

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

      {/* LISTE */}
      <SafeAreaView style={styles.container}>
        <FlatList
          data={evenements}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/evenement/[id]',
                  params: { id: item.id.toString() },
                })
              }
            >
              <Image
                source={item.image ? { uri: item.image } : require('@/assets/images/hellfest.jpg')}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={3}>
                  {item.descriptions}
                </Text>
                <View style={styles.tagRow}>
                  {item.tags.slice(0, 3).map((tag, i) => (
                    <View key={i} style={styles.tagCapsule}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  whiteZoneHaut: {
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    marginTop: 15,
  },
  topComponents: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    height: 80,
  },
  mapZoneCenter: {
    position: 'absolute',
    bottom: 180,
    right: 30,
    height: 50,
    width: 50,
    zIndex: 20,
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
  
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom:16,
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
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});