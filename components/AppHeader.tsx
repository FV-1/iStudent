import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Brand, HEADER_HEIGHT } from '@/constants/theme';

type AppHeaderProps = {
  /** Ville affichée dans la pastille de droite. */
  city?: string;
  onSearchPress?: () => void;
  onCityPress?: () => void;
  /**
   * `absolute` superpose le header au contenu (utilisé au-dessus de la carte),
   * `static` le place dans le flux normal.
   */
  variant?: 'absolute' | 'static';
};

/**
 * Header commun aux quatre écrans. Il était auparavant copié-collé à
 * l'identique dans chacun d'eux, avec ses styles redéfinis à chaque fois.
 */
export function AppHeader({
  city = 'Nantes',
  onSearchPress,
  onCityPress,
  variant = 'absolute',
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.container, variant === 'absolute' && styles.absolute]}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => router.push('/')}
          accessibilityRole="button"
          accessibilityLabel="IStudent, revenir à la carte"
        >
          <Text style={styles.logo}>IStudent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSearchPress}
          disabled={!onSearchPress}
          accessibilityRole="button"
          accessibilityLabel="Rechercher"
        >
          <Ionicons name="search" size={20} color="grey" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cityButton}
          onPress={onCityPress}
          disabled={!onCityPress}
          accessibilityRole="button"
          accessibilityLabel={`Ville sélectionnée : ${city}`}
        >
          <Text style={styles.cityText}>{city}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    backgroundColor: Brand.surface,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    height: 80,
  },
  logo: {
    fontSize: 30,
    color: Brand.primary,
    fontWeight: 'bold',
  },
  cityButton: {
    borderWidth: 2,
    borderColor: Brand.primary,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cityText: {
    fontWeight: 'bold',
    color: Brand.primary,
  },
});
