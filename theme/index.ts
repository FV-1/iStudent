import { useColorScheme } from '@/hooks/useColorScheme';
import { darkTheme, lightTheme, type AppTheme } from './tokens';

export * from './tokens';

/**
 * Thème actif selon l'apparence du système.
 * L'application ignorait complètement le mode sombre : toutes les surfaces
 * étaient blanches en dur.
 */
export function useTheme(): AppTheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
