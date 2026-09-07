/**
 * Config dynamique : complète app.json avec les valeurs qui dépendent de
 * l'environnement et n'ont donc rien à faire dans un fichier versionné.
 *
 * react-native-maps exige une clé Google Maps sur Android dès qu'on quitte
 * Expo Go. Sans elle, la carte s'affiche en gris uni sur l'APK — et comme
 * la carte est l'écran d'accueil, l'application paraît cassée.
 *
 * Renseignez EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY (voir .env.example).
 */
const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY;

module.exports = ({ config }) => {
  if (!googleMapsApiKey && process.env.EAS_BUILD === 'true') {
    console.warn(
      '\n[app.config.js] EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY absente : ' +
        "la carte Android s'affichera en gris sur ce build.\n"
    );
  }

  return {
    ...config,
    android: {
      ...config.android,
      ...(googleMapsApiKey
        ? { config: { googleMaps: { apiKey: googleMapsApiKey } } }
        : {}),
    },
  };
};
