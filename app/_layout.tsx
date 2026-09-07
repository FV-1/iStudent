import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  type Theme,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PlacesProvider } from '@/contexts/PlacesContext';
import { useTheme } from '@/theme';

export { ErrorBoundary } from '@/components/ErrorBoundary';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const theme = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // On masque le splash seulement une fois les polices prêtes, pour
      // éviter le flash de texte non stylé.
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Les couleurs de navigation sont dérivées des jetons de l'application :
  // sinon les transitions d'écran laissent apparaître un fond blanc en
  // mode sombre.
  const navigationTheme: Theme = {
    ...(theme.dark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.dark ? DarkTheme : DefaultTheme).colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={navigationTheme}>
          <PlacesProvider>
            <Stack
              screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.primary,
                headerTitleStyle: { color: theme.colors.textPrimary },
                contentStyle: { backgroundColor: theme.colors.background },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="evenement/[id]"
                options={{ headerShown: false, animation: 'slide_from_bottom' }}
              />
              <Stack.Screen name="places/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ title: 'Introuvable' }} />
            </Stack>
          </PlacesProvider>
          <StatusBar style={theme.dark ? 'light' : 'dark'} />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
