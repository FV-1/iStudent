import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function ProfileScreen() {
  const router = useRouter();
  const friends = [
    { username: '@enzo_romoli', image: 'https://scontent-cdg4-3.xx.fbcdn.net/v/t1.15752-9/495047097_9651316251642163_7794720123814034_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=0024fc&_nc_ohc=Y_DDXWtgy80Q7kNvwHrmWRT&_nc_oc=AdlBc03M5HlAFZaW0SXSqsQa6HWthtixf6PcUhgzy7znbh-KHuhF0Wx2J3ZLAp3Ud04&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-3.xx&oh=03_Q7cD2wHQ39cpZqnFcMR5_F62C6mrB2XEyBKbvcQsaIw9oDZOZQ&oe=68A8A4C1', status: 'En ville' },
    { username: '@hafsa_rak', image: 'https://scontent-cdg4-2.cdninstagram.com/v/t51.2885-19/436233337_407121915472159_8373766685675360981_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-cdg4-2.cdninstagram.com&_nc_cat=107&_nc_oc=Q6cZ2QEDFLgrOAQoenPv89NbO1XiHPaJcxTIbAXA5ou2cMFC-itnW_gGue7_CKUAhoBBJsE&_nc_ohc=YsnirTzBg88Q7kNvwGjzXu2&_nc_gid=NQ47NEPRIyLyjDyJ8Q8kiA&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_AfSS4YFxiQdkRQ8Vi_WXUbA215HKO6WiqqbD8iRcmtLpYg&oe=6886E4D7&_nc_sid=7d3ac5' },
    { username: '@martin_rngx', image: 'https://scontent-cdg4-1.xx.fbcdn.net/v/t1.15752-9/521290481_772943211874118_9091466869842887733_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=0024fc&_nc_ohc=rh_kXoHuvbUQ7kNvwG_-ye5&_nc_oc=Adm0ELfhcJJJBEGQ92GH4YJQk4ef2DuOiUrSFrmcERTXrjwdi34CS1NpWOei4E8ZYRY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-1.xx&oh=03_Q7cD2wGCcxhxZuLZ6bsS_l58CjcGOi3SnCFCVsfxWFZAcgIDKw&oe=68A8A2D7 '},
    { username: '@elsattaquent', image: 'https://scontent-cdg4-2.xx.fbcdn.net/v/t1.15752-9/502611728_1252170429584148_7351636190912703662_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=0024fc&_nc_ohc=H4Fs5uC9sB4Q7kNvwEqt8_8&_nc_oc=Adn30jd6RiKea39mtTV10OAuIN7d7VK-8f0UOLT3goSIDMzcqPDXSOCqED0fHsz6R30&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cdg4-2.xx&oh=03_Q7cD2wEeyMMXVqtg22wmsTDMVC34nnt8cINaMdcnoER3T-DAJw&oe=68A8A47C' , status: 'En ville'},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
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
