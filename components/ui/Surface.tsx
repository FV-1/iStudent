import { View, type ViewProps } from 'react-native';

import { radius as radiusTokens, useTheme } from '@/theme';

export type SurfaceProps = ViewProps & {
  /** Niveau d'ombre ; `none` s'appuie sur la bordure pour séparer du fond. */
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  radius?: keyof typeof radiusTokens;
  padded?: boolean;
  bordered?: boolean;
};

/** Conteneur de base : fond, rayon, bordure et ombre pris dans le thème. */
export function Surface({
  elevation = 'sm',
  radius = 'xl',
  padded = false,
  bordered = true,
  style,
  ...rest
}: SurfaceProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: radiusTokens[radius],
        },
        bordered && { borderWidth: 1, borderColor: theme.colors.border },
        padded && { padding: 16 },
        elevation !== 'none' && theme.shadows[elevation],
        style,
      ]}
      {...rest}
    />
  );
}
