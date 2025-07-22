import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'salmon',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'white',
          },
          default: {
            backgroundColor: 'white',
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => (
            <Icon name="map" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explorer"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Icon name="compass" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
      // fichier (tabs)/events.tsx à créer quand resto et bar seront réunis en un seul fichier
        name="restaurants_explore" // temporaire car destiné à events
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => (
            <Icon name="star" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Icon name="circle" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}