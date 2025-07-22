import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function ProfileScreen() {
  const router = useRouter();
  const friends = [
    { username: '@liliancsd', image: 'https://i.pravatar.cc/150?img=12', status: 'En ville' },
    { username: '@clarahd', image: 'https://i.pravatar.cc/150?img=47' },
    { username: '@jerem_me', image: null },
    { username: '@jerem_me', image: null , status: 'En ville'},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.whiteZoneHaut}>
        <View style={styles.topComponents}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={{ fontSize: 30, color: '#FF6666', fontWeight: 'bold' }}>IStuud</Text>
          </TouchableOpacity>
          <Ionicons name="search" size={20} color="grey" />
          <TouchableOpacity style={styles.bigButton}>
            <Text style={styles.buttonText}>Nantes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profil principal */}
      <View style={styles.profileSection}>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#FF6666" />
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/image-profil2.jpg')}
            style={styles.avatar}
        />

        <TouchableOpacity>
          <Feather name="heart" size={24} color="#FF6666" />
        </TouchableOpacity>
      </View>
      <Text style={styles.username}>@victor_flc</Text>

      {/* Bloc StudFriends */}
      <View style={styles.friendsBlock}>
        <Text style={styles.friendsTitle}>StudFriends</Text>
        <View style={styles.friendsList}>
          {friends.map((friend, index) => (
            <View key={index} style={styles.friendItem}>
              <View>
                <Image
                  source={
                    friend.image
                      ? { uri: friend.image }
                      : require('../../assets/images/hellfest.jpg') // image locale par défaut
                  }
                  style={styles.friendAvatar}
                />
                {friend.status && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{friend.status}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.friendUsername}>{friend.username}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bloc Événements à venir */}
      <View style={styles.eventsBlock}>
        <Text style={styles.eventsTitle}>Événements à venir</Text>
        <View style={styles.eventsList}>
          <View style={styles.eventItem}>
            <Image
              source={{ uri: 'https://picsum.photos/80/80?random=1' }}
              style={styles.eventThumbnail}
            />
            <View style={styles.eventText}>
              <Text style={styles.eventName}>Concert de Jazz</Text>
              <Text style={styles.eventDate}>25 juillet 2025</Text>
            </View>
          </View>
          <View style={styles.eventItem}>
            <Image
              source={{ uri: 'https://picsum.photos/80/80?random=2' }}
              style={styles.eventThumbnail}
            />
            <View style={styles.eventText}>
              <Text style={styles.eventName}>Conférence Tech ESGI</Text>
              <Text style={styles.eventDate}>2 août 2025</Text>
            </View>
          </View>
          <View style={styles.eventItem}>
            <Image
              source={{ uri: 'https://picsum.photos/80/80?random=3' }}
              style={styles.eventThumbnail}
            />
            <View style={styles.eventText}>
              <Text style={styles.eventName}>Marathon de Nantes</Text>
              <Text style={styles.eventDate}>15 août 2025</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer Nav (commenté) 
      <View style={styles.footer}>
        <Ionicons name="map-outline" size={24} color="#000" />
        <Ionicons name="compass-outline" size={24} color="#000" />
        <Ionicons name="sparkles-outline" size={24} color="#000" />
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=15' }}
          style={[styles.footerAvatar, { borderColor: '#FF6666' }]}
        />
      </View>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 90, // place pour header absolu
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
  topComponents: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    height: 80,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between', // moins d'espace qu'avec space-around
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 20,
    paddingHorizontal: 80, // évite que les boutons collent aux bords
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#FF6666',
  },
  username: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
  },
  friendsBlock: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  friendsList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  friendItem: {
    alignItems: 'center',
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  friendUsername: {
    marginTop: 6,
    color: '#FF6666',
    fontWeight: '600',
    fontSize: 12,
  },
  statusBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#FF6666',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventsBlock: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    color: '#000000ff',
  },
  eventsList: {
    // liste verticale par défaut
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  eventText: {
    flexShrink: 1,
  },
  eventName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  eventDate: {
    fontSize: 12,
    color: 'grey',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 70,
    left: 0,
    right: 0,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 12,
  },
  footerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
  },
});
