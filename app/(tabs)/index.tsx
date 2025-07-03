import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App() {
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
        <Circle
          center={{ latitude: 47.228166, longitude: -1.5634918 }}
          radius={300}
          strokeWidth={2}
          strokeColor="green"
          fillColor="rgba(255,255,0,0.2)"
        />
      </MapView>
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

      {/* Groupe Cercle + Avion à droite */}
      <View style={styles.mapZoneCenter}>
        <View style={styles.iconNav}>
          <Icon name="circle" size= {60} color="white" style={{ position: 'absolute' }} />
          <Icon name="paper-plane" size={20} color="black" style={{ zIndex: 1, marginRight : 3, }} />
        </View>
      </View>

      {/* Zone basse */}
      <View style={styles.whiteZoneBas}>
        <View style={styles.icons}>
          <Icon name="map" size={25} color="salmon" />
          <Icon name="compass" size={25} color="black" />
          <Icon name="star" size={25} color="black" />
          <Icon name="circle" size={25} color="black" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  whiteZoneBas: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    bottom: 120,  
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
});
