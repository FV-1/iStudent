# IStudent

Application mobile qui rassemble les événements et les bons plans étudiants
à Nantes : une carte interactive, un annuaire de lieux (restaurants, bars,
bibliothèques) et un profil avec ses amis et ses prochaines sorties.

Projet annuel ESGI — Expo / React Native.

## Démarrage

```bash
npm install
npx expo start
```

Puis ouvrez le projet dans **Expo Go** (version SDK 54), un émulateur Android
ou un simulateur iOS.

### Variables d'environnement

```bash
cp .env.example .env
```

Une seule variable est nécessaire, et uniquement pour les builds natifs :

| Variable | Rôle |
|---|---|
| `EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY` | Clé « Maps SDK for Android ». **Sans elle, la carte s'affiche en gris uni sur un APK.** Inutile dans Expo Go. |

Les données open data (Loire-Atlantique) et OpenStreetMap sont publiques et
ne demandent aucune clé.

## Scripts

| Commande | Effet |
|---|---|
| `npm start` | Serveur de développement Expo |
| `npm run android` / `ios` / `web` | Démarrage ciblé sur une plateforme |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests unitaires (Jest) |

## Structure

```
app/                 Routes (expo-router, routage par fichiers)
  (tabs)/            Les 4 onglets : carte, explorer, événements, profil
  evenement/[id]     Détail d'un événement (données locales)
  places/[id]        Détail d'un lieu (données distantes)
components/
  ui/                Primitives : Text, Button, Chip, SearchBar, Skeleton...
  AppHeader          Header commun (flou natif, zone sûre)
  ContentCard        Carte de contenu des listes
  FloatingTabBar     Barre d'onglets flottante à indicateur glissant
  DetailScreenLayout Gabarit des écrans de détail (héro en parallaxe)
contexts/            PlacesContext : lieux chargés une fois, partagés
lib/                 Accès aux API, filtres, recherche, style de carte
theme/               Jetons de design et thèmes clair/sombre
assets/data/         Jeu d'événements embarqué (produit par le scraper)
scripts/             Scraper Python de l'agenda nantais
```

## Système de design

Toutes les valeurs visuelles viennent de [`theme/tokens.ts`](theme/tokens.ts) :
échelle de couleurs, espacements, rayons, typographie, ombres et durées
d'animation. Les écrans ne codent plus aucune couleur en dur.

```tsx
import { spacing, radius, useTheme } from '@/theme';

const theme = useTheme(); // bascule clair/sombre selon le système
```

Le **mode sombre** est pris en charge partout, y compris la carte
(`lib/mapStyle.ts`). Pour ajuster l'identité visuelle, il suffit de modifier
l'échelle `coral` dans `theme/tokens.ts`.

### Composants

Construisez les écrans à partir des primitives de `components/ui/` plutôt
qu'avec des `StyleSheet` ad hoc :

| Composant | Usage |
|---|---|
| `Text` | Typographie et couleur selon le thème (`variant`, `tone`) |
| `Button` / `IconButton` | Actions, avec compression au doigt et haptique |
| `Chip` | Filtre sélectionnable animé |
| `SearchBar` | Recherche instantanée |
| `Skeleton` / `SkeletonCard` | Chargement (préféré au spinner) |
| `EmptyState` | État vide ou en erreur, actionnable |
| `Surface` | Conteneur : fond, bordure, ombre |

## Sources de données

| Contenu | Source | Type |
|---|---|---|
| Événements | `assets/data/evenements.json` | Statique, généré hors ligne |
| Restaurants | Open data Loire-Atlantique | API publique |
| Bibliothèques | Open data Loire-Atlantique | API publique |
| Bars | OpenStreetMap (Overpass) | API publique |

### Rafraîchir les événements

Le fichier d'événements est **figé** : il doit être régénéré manuellement.

```bash
cd scripts
pip install requests beautifulsoup4
python PythonDateScapper.py --urls   # reconstruit la liste des URLs
python PythonDateScapper.py          # produit evenements.json
```

Copiez ensuite `evenements.json` vers `assets/data/`.

> ⚠️ Le jeu de données actuellement livré date de l'été 2025 et doit être
> régénéré avant toute mise en ligne.

## Tests

Les tests couvrent la logique métier : filtrage des événements, extraction
des coordonnées et couche d'accès aux API (identifiants déterministes,
tolérance aux pannes de source).

```bash
npm test
```
