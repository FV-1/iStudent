import evenements from '@/assets/data/evenements.json';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { ListCard } from '@/components/ListCard';
import { HEADER_HEIGHT } from '@/constants/theme';

export default function ListeEvenements() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <AppHeader variant="static" />

      <SafeAreaView style={styles.container}>
        <FlatList
          data={evenements}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <ListCard
              title={item.title}
              description={item.descriptions}
              imageUrl={item.image}
              tags={item.tags}
              onPress={() =>
                router.push({ pathname: '/evenement/[id]', params: { id: String(item.id) } })
              }
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  listContainer: {
    paddingBottom: HEADER_HEIGHT,
  },
});
