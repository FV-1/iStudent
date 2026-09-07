import { StyleSheet } from 'react-native';

import { Brand, HEADER_HEIGHT } from '@/constants/theme';

/**
 * Styles propres à l'écran carte. Les styles du header et des cartes de liste
 * vivent désormais dans <AppHeader /> et <ListCard />.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    // Au-dessus de la barre d'onglets (70 px) : la fiche passait dessous.
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: Brand.surface,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
  },
  cardImage: {
    width: 100,
    height: '100%',
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: Brand.textMuted,
  },
  tagCapsule: {
    backgroundColor: Brand.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  tagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  filtreScroll: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  filtreContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
    gap: 10,
  },
  filtreCapsule: {
    backgroundColor: Brand.surface,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  filtreCapsuleActive: {
    backgroundColor: Brand.primary,
  },
  filtreText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
  },
  filtreTextActive: {
    color: Brand.surface,
  },
});

export default styles;
