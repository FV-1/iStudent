import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { radius, spacing, typography, useTheme } from '@/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

/**
 * Barre de recherche. L'icône loupe du header d'origine n'était reliée à rien :
 * la recherche filtre désormais réellement la liste à la frappe.
 */
export function SearchBar({ value, onChangeText, placeholder = 'Rechercher...' }: SearchBarProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceSunken, borderColor: theme.colors.border },
      ]}
    >
      <Ionicons name="search" size={18} color={theme.colors.textTertiary} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        style={[styles.input, typography.body, { color: theme.colors.textPrimary }]}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Champ de recherche"
      />

      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Effacer la recherche"
        >
          <Ionicons name="close-circle" size={18} color={theme.colors.textTertiary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    height: 46,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    padding: 0,
  },
});
