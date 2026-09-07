/**
 * Jetons de design de l'application.
 *
 * Tout ce qui touche à la couleur, l'espacement, le rayon, la typographie et
 * l'ombre vient d'ici. Les écrans ne codent plus aucune valeur en dur : c'est
 * ce qui permet d'avoir un mode sombre cohérent et de faire évoluer l'identité
 * visuelle depuis un seul fichier.
 */

/** Échelle corail, dérivée du #FF6666 historique de l'application. */
const coral = {
  50: '#FFF1F1',
  100: '#FFE1E2',
  200: '#FFC5C7',
  300: '#FFA0A3',
  400: '#FF7C80',
  500: '#FF5A5F',
  600: '#ED3B42',
  700: '#C62A31',
  800: '#8E1F24',
  900: '#5C1417',
} as const;

const neutral = {
  0: '#FFFFFF',
  25: '#FBFBFC',
  50: '#F5F5F7',
  100: '#ECECEF',
  200: '#DEDEE3',
  300: '#C4C4CC',
  400: '#9A9AA5',
  500: '#71717D',
  600: '#55555F',
  700: '#3A3A43',
  800: '#24242B',
  850: '#1C1C22',
  900: '#141419',
  950: '#0D0D11',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 56,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800' },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  headline: { fontSize: 19, lineHeight: 25, fontWeight: '700' },
  subtitle: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
} as const;

export type TypographyVariant = keyof typeof typography;

/** Durées d'animation, pour que tout bouge au même rythme. */
export const motion = {
  fast: 150,
  base: 240,
  slow: 380,
  spring: { damping: 18, stiffness: 180, mass: 0.9 },
} as const;

export interface AppTheme {
  dark: boolean;
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    surfaceSunken: string;
    border: string;
    borderStrong: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textOnPrimary: string;
    primary: string;
    primaryHover: string;
    primarySoft: string;
    primaryBorder: string;
    success: string;
    successSoft: string;
    warning: string;
    warningSoft: string;
    danger: string;
    dangerSoft: string;
    skeleton: string;
    skeletonHighlight: string;
    scrim: string;
    /** Teinte du flou natif des barres translucides. */
    blurTint: 'light' | 'dark';
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
}

export const lightTheme: AppTheme = {
  dark: false,
  colors: {
    background: neutral[50],
    surface: neutral[0],
    surfaceElevated: neutral[0],
    surfaceSunken: neutral[100],
    border: neutral[100],
    borderStrong: neutral[200],
    textPrimary: neutral[900],
    textSecondary: neutral[500],
    textTertiary: neutral[400],
    textOnPrimary: neutral[0],
    primary: coral[500],
    primaryHover: coral[600],
    primarySoft: coral[50],
    primaryBorder: coral[200],
    success: '#0F9D58',
    successSoft: '#E6F5ED',
    warning: '#B26A00',
    warningSoft: '#FFF4E5',
    danger: coral[700],
    dangerSoft: coral[50],
    skeleton: neutral[100],
    skeletonHighlight: neutral[50],
    scrim: 'rgba(13,13,17,0.55)',
    blurTint: 'light',
  },
  shadows: {
    sm: {
      shadowColor: '#0D0D11',
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 2,
    },
    md: {
      shadowColor: '#0D0D11',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 16,
      elevation: 6,
    },
    lg: {
      shadowColor: '#0D0D11',
      shadowOpacity: 0.16,
      shadowOffset: { width: 0, height: 12 },
      shadowRadius: 28,
      elevation: 12,
    },
  },
};

export const darkTheme: AppTheme = {
  dark: true,
  colors: {
    background: neutral[950],
    surface: neutral[850],
    surfaceElevated: neutral[800],
    surfaceSunken: neutral[900],
    border: '#2A2A33',
    borderStrong: '#3A3A43',
    textPrimary: neutral[50],
    textSecondary: neutral[400],
    textTertiary: neutral[500],
    textOnPrimary: neutral[950],
    // Le corail 500 manque de contraste sur fond sombre : on éclaircit.
    primary: coral[400],
    primaryHover: coral[300],
    primarySoft: 'rgba(255,124,128,0.14)',
    primaryBorder: 'rgba(255,124,128,0.32)',
    success: '#4ADE80',
    successSoft: 'rgba(74,222,128,0.14)',
    warning: '#FBBF24',
    warningSoft: 'rgba(251,191,36,0.14)',
    danger: coral[300],
    dangerSoft: 'rgba(255,160,163,0.14)',
    skeleton: '#23232B',
    skeletonHighlight: '#2E2E38',
    scrim: 'rgba(0,0,0,0.6)',
    blurTint: 'dark',
  },
  shadows: {
    // Les ombres portées sont quasi invisibles sur fond sombre : on garde une
    // élévation Android faible et on s'appuie sur les bordures pour séparer.
    sm: { shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 },
    md: { shadowColor: '#000', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 6 }, shadowRadius: 16, elevation: 6 },
    lg: { shadowColor: '#000', shadowOpacity: 0.5, shadowOffset: { width: 0, height: 12 }, shadowRadius: 28, elevation: 12 },
  },
};

export const palette = { coral, neutral };
