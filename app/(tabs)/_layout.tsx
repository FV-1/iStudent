import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Brand } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Brand.primary,
        tabBarInactiveTintColor: 'black',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false,
        tabBarStyle: {
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
          title: 'Carte',
          tabBarAccessibilityLabel: 'Carte',
          tabBarIcon: ({ color }) => <FontAwesome name="map" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explorer"
        options={{
          title: 'Explorer',
          tabBarAccessibilityLabel: 'Explorer les lieux',
          tabBarIcon: ({ color }) => <FontAwesome name="compass" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="restaurants_explore"
        options={{
          title: 'Événements',
          tabBarAccessibilityLabel: 'Événements',
          tabBarIcon: ({ color }) => <FontAwesome name="star" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarAccessibilityLabel: 'Profil',
          tabBarIcon: () => (
            <Image
              source={require('@/assets/images/image-profil2.jpg')}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
