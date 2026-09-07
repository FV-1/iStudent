import { Tabs } from 'expo-router';

import { FloatingTabBar } from '@/components/FloatingTabBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      // La barre par défaut est remplacée par une barre flottante animée,
      // qui gère elle-même la zone sûre du bas.
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Carte' }} />
      <Tabs.Screen name="explorer" options={{ title: 'Explorer' }} />
      <Tabs.Screen name="restaurants_explore" options={{ title: 'Événements' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
