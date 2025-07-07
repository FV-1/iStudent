import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import MapView, { Circle , Marker, } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import evenements from '@/assets/data/evenements.json';
import React, { useState } from 'react';




export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        //provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: 47.228166,
          longitude: -1.5634918,
          latitudeDelta: 0.002,
          longitudeDelta: 0.0421,
        }}
      >
        {evenements.map((evenement) => {
          const lat = parseFloat(evenement.coordinates?.[0]?.[0] ?? "0");
          const lon = parseFloat(evenement.coordinates?.[0]?.[1] ?? "0");

          if (!lat || !lon) {
            console.warn("Coordonnées manquantes pour :", evenement.title);
            return null;
          }

          return (
            <Marker
              key={evenement.id}
              coordinate={{ latitude: lat, longitude: lon }}
              image={require('../../assets/images/pointBorzoi.png')}
              title={evenement.title}
              description={evenement.descriptions}>
              {/*
                <Text>
                  {evenement.id}
                </Text>
              */}
            </Marker>
          );
        })}
        <Circle
          center={{ latitude: 47.228166, longitude: -1.5634918 }}
          radius={300}
          strokeWidth={2}
          strokeColor="green"
          fillColor="rgba(255,255,0,0.2)"
        />
      </MapView>
       
      {/* Groupe Cercle + Avion à droite */}
      <View style={styles.mapZoneCenter}>
        <View style={styles.iconNav}>
          <Icon name="circle" size= {60} color="white" style={{ position: 'absolute' }} />
          <Icon name="paper-plane" size={20} color="black" style={{ zIndex: 1, marginRight : 3, }} />
        </View>
      </View>
      
      {/* Zone evenement */}
      <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image 
          source={require('../../assets/images/hellfest.jpg')} 
          style={styles.cardImage} 
          resizeMode="cover" 
        />
        
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.cardTitle}>Hellfest 2025</Text>
          <Text style={styles.cardSubtitle}>Concert des enfers</Text>
          <Text style={styles.cardDescription}>Rejoignez-nous pour un weekend endiablé à Clisson.</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
      <View style={styles.tagCapsule}><Text style={styles.tagText}>#Festival</Text></View>
      <View style={styles.tagCapsule}><Text style={styles.tagText}>#Payant</Text></View>
      <View style={styles.tagCapsule}><Text style={styles.tagText}>#Metal</Text></View>
    </View>
    </View>
      
      {/* Zone haute */}
      <View style={styles.whiteZoneHaut}>
        <View style={styles.topComponents}>
          <Text style={{ fontSize: 30, color: '#FF6666', fontWeight: 'bold' }}>IStuud</Text>
          <Icon name="circle" size={30} color="#D9D9D9" />
          <Icon name="search" size= {20} color="grey"  />
          <TouchableOpacity style={styles.bigButton}>
            <Text style={styles.buttonText}>Nantes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
  },
  
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
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
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    marginTop: 15,
  },
  topComponents: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    marginTop: 30,
    marginLeft: -15,
  },
  mapZoneCenter: {
    position: 'absolute',
    bottom: 180,  
    right: 30,    
    height: 50,
    width: 50,
    zIndex: 20,
  },
  iconNav: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bigButton: {
    borderWidth: 2,
    borderColor: '#FF6666',
    alignItems: 'center',
    padding: 10,
    width : 100 ,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  cardImage: {
  width: 100,
  height: '100%',
  borderRadius: 10,
},

cardTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 5,
},

cardSubtitle: {
  fontSize: 16,
  color: '#555',
  marginBottom: 5,
},

cardDescription: {
  fontSize: 14,
  color: '#777',
},

tagCapsule: {
  backgroundColor: '#FF6666',
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 10,
  marginRight: 5,
  marginTop: 10,
  marginBottom: 5,
  
},
tagText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 12,
},
});
