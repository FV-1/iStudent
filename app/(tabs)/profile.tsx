import evenements from '@/assets/data/evenements.json';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { Brand, HEADER_HEIGHT } from '@/constants/theme';

/**
 * Les avatars pointaient sur des URLs signées Facebook/Instagram dont les
 * jetons ont expiré en août 2025 : toutes les images étaient cassées.
 * Les portraits correspondants étaient déjà présents dans assets/images.
 */
const FRIENDS = [
  { username: '@enzo_romoli', image: require('@/assets/images/enzo.jpg'), status: 'En ville' },
  { username: '@hafsa_rak', image: require('@/assets/images/hafsa.jpg') },
  { username: '@martin_rngx', image: require('@/assets/images/martin.jpg') },
  { username: '@elsattaquent', image: require('@/assets/images/elsa.jpg'), status: 'En ville' },
];

const UPCOMING_EVENTS = evenements.slice(0, 3);

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Réglages">
            <Ionicons name="settings-outline" size={24} color={Brand.primary} />
          </TouchableOpacity>

          <Image
            source={require('@/assets/images/image-profil2.jpg')}
            style={styles.avatar}
            accessibilityLabel="Votre photo de profil"
          />

          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Favoris">
            <Feather name="heart" size={24} color={Brand.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>@victor_flc</Text>

        <View style={styles.friendsBlock}>
          <Text style={styles.friendsTitle}>StudFriends</Text>
          <View style={styles.friendsList}>
            {FRIENDS.map((friend) => (
              <View key={friend.username} style={styles.friendItem}>
                <View>
                  <Image
                    source={friend.image}
                    style={styles.friendAvatar}
                    accessibilityLabel={`Photo de ${friend.username}`}
                  />
                  {!!friend.status && (
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

        <View style={styles.eventsBlock}>
          <Text style={styles.eventsTitle}>Événements à venir</Text>
          <View>
            {UPCOMING_EVENTS.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventItem}
                onPress={() =>
                  router.push({ pathname: '/evenement/[id]', params: { id: String(event.id) } })
                }
                accessibilityRole="button"
                accessibilityLabel={`Événement ${event.title}`}
              >
                <Image source={{ uri: event.image }} style={styles.eventThumbnail} />
                <View style={styles.eventText}>
                  <Text style={styles.eventName} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT + 20,
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 80,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: Brand.primary,
  },
  username: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: Brand.textPrimary,
    marginBottom: 24,
  },
  friendsBlock: {
    backgroundColor: Brand.surface,
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
    color: Brand.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  statusBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: Brand.primary,
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
    backgroundColor: Brand.surface,
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
    color: '#000',
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
    backgroundColor: '#ddd',
  },
  eventText: {
    flexShrink: 1,
  },
  eventName: {
    fontWeight: '600',
    fontSize: 14,
    color: Brand.textPrimary,
  },
  eventDate: {
    fontSize: 12,
    color: 'grey',
  },
});
