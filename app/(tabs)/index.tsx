import evenements from '@/assets/data/evenements.json';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import {
  EVENT_FILTERS,
  filterEvenements,
  getEventCoordinates,
  type Evenement,
  type EventFilterKey,
} from '@/lib/eventFilters';
import { darkMapStyle } from '@/lib/mapStyle';
import { radius, spacing, useTheme } from '@/theme';

const NANTES_REGION: Region = {
  latitude: 47.2184,
  longitude: -1.5536,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

const MARKER_IMAGE = require('@/assets/images/pointBorzoi.png');
const FALLBACK_IMAGE = require('@/assets/images/hellfest.jpg');

export default function MapScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const sheetRef = useRef<BottomSheet>(null);

  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [activeFilter, setActiveFilter] = useState<EventFilterKey>('Tous');
  const [locationGranted, setLocationGranted] = useState(false);

  const snapPoints = useMemo(() => ['38%', '72%'], []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!cancelled) {
          setLocationGranted(status === Location.PermissionStatus.GRANTED);
        }
      } catch (error) {
        console.warn('Permission de localisation indisponible :', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleEvents = useMemo(
    () => filterEvenements(evenements, activeFilter),
    [activeFilter]
  );

  const closeSheet = useCallback(() => {
    sheetRef.current?.close();
    setSelectedEvent(null);
  }, []);

  // Si l'événement affiché sort du filtre courant, la fiche se referme.
  useEffect(() => {
    if (selectedEvent && !visibleEvents.some((e) => e.id === selectedEvent.id)) {
      closeSheet();
    }
  }, [visibleEvents, selectedEvent, closeSheet]);

  const handleSelect = useCallback((evenement: Evenement) => {
    setSelectedEvent(evenement);
    sheetRef.current?.snapToIndex(0);

    const coordinates = getEventCoordinates(evenement);
    if (coordinates) {
      mapRef.current?.animateToRegion(
        { ...coordinates, latitudeDelta: 0.012, longitudeDelta: 0.012 },
        420
      );
    }
  }, []);

  const recenter = useCallback(() => {
    mapRef.current?.animateToRegion(NANTES_REGION, 480);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        showsUserLocation={locationGranted}
        showsMyLocationButton={false}
        showsCompass={false}
        initialRegion={NANTES_REGION}
        customMapStyle={theme.dark ? darkMapStyle : undefined}
        onPress={closeSheet}
      >
        {visibleEvents.map((evenement) => {
          const coordinates = getEventCoordinates(evenement);
          if (!coordinates) {
            return null;
          }

          return (
            <Marker
              key={evenement.id}
              coordinate={coordinates}
              image={MARKER_IMAGE}
              title={evenement.title}
              onPress={() => handleSelect(evenement)}
            />
          );
        })}
      </MapView>

      <AppHeader variant="floating" subtitle={`${visibleEvents.length} événements`} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterScroll, { top: insets.top + 76 }]}
        contentContainerStyle={styles.filterContent}
      >
        {EVENT_FILTERS.map((filter) => (
          <Chip
            key={filter.key}
            label={filter.label}
            selected={filter.key === activeFilter}
            onPress={() => setActiveFilter(filter.key)}
            accessibilityLabel={`Filtrer par ${filter.label}`}
          />
        ))}
      </ScrollView>

      <View style={[styles.fab, { bottom: insets.bottom + 96 }]}>
        <IconButton name="locate" onPress={recenter} accessibilityLabel="Recentrer sur Nantes" />
      </View>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={() => setSelectedEvent(null)}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.borderStrong }}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selectedEvent && (
            <>
              <View style={styles.sheetHeader}>
                <Image
                  source={
                    selectedEvent.image ? { uri: selectedEvent.image } : FALLBACK_IMAGE
                  }
                  style={styles.sheetImage}
                  contentFit="cover"
                  transition={220}
                />

                <View style={styles.sheetHeaderText}>
                  <Text variant="headline" numberOfLines={2}>
                    {selectedEvent.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={13} color={theme.colors.textSecondary} />
                    <Text variant="caption" tone="secondary" numberOfLines={1}>
                      {selectedEvent.date}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={13} color={theme.colors.textSecondary} />
                    <Text variant="caption" tone="secondary" numberOfLines={1}>
                      {selectedEvent.location}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.tagRow}>
                {selectedEvent.tags.slice(0, 4).map((tag) => (
                  <View
                    key={tag}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: theme.colors.primarySoft,
                        borderColor: theme.colors.primaryBorder,
                      },
                    ]}
                  >
                    <Text variant="caption" tone="brand">
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>

              <Text variant="body" tone="secondary" numberOfLines={5} style={styles.description}>
                {selectedEvent.descriptions}
              </Text>

              <Button
                label="Voir l'événement"
                onPress={() =>
                  router.push({
                    pathname: '/evenement/[id]',
                    params: { id: String(selectedEvent.id) },
                  })
                }
                style={styles.cta}
              />
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterScroll: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 15,
    maxHeight: 56,
  },
  filterContent: {
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    zIndex: 15,
  },
  sheetContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
    gap: spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  sheetImage: {
    width: 92,
    height: 92,
    borderRadius: radius.lg,
  },
  sheetHeaderText: {
    flex: 1,
    gap: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  description: {
    marginTop: -spacing.xs,
  },
  cta: {
    marginTop: spacing.xs,
  },
});
