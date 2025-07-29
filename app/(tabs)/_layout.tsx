import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';
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
        tabBarStyle: {
          left: 20,
          right: 20,
          borderRadius: 20,
          height: 70,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => (
            <Icon name="map" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explorer"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Icon name="compass" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="restaurants_explore"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => (
            <Icon name="star" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => (
            <Image
              source={require('../../assets/images/image-profil2.jpg')}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
