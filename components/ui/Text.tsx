import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { typography, useTheme, type TypographyVariant } from '@/theme';

type Tone = 'primary' | 'secondary' | 'tertiary' | 'brand' | 'onPrimary' | 'danger' | 'success';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  tone?: Tone;
  align?: TextStyle['textAlign'];
};

/**
 * Texte de l'application. Centralise l'échelle typographique et la couleur
 * selon le thème : plus aucun `color: '#333'` dispersé dans les écrans.
 */
export function Text({
  variant = 'body',
  tone = 'primary',
  align,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();

  const toneColor: Record<Tone, string> = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textSecondary,
    tertiary: theme.colors.textTertiary,
    brand: theme.colors.primary,
    onPrimary: theme.colors.textOnPrimary,
    danger: theme.colors.danger,
    success: theme.colors.success,
  };

  return (
    <RNText
      style={[
        typography[variant] as TextStyle,
        { color: toneColor[tone] },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...rest}
    />
  );
}
