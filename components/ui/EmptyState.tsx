import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { radius, spacing, useTheme } from '@/theme';

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** État vide ou en erreur : explicite, illustré et actionnable. */
export function EmptyState({
  icon = 'compass-outline',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.primarySoft }]}>
        <Ionicons name={icon} size={30} color={theme.colors.primary} />
      </View>

      <Text variant="headline" align="center" style={styles.title}>
        {title}
      </Text>

      {!!description && (
        <Text variant="body" tone="secondary" align="center">
          {description}
        </Text>
      )}

      {!!actionLabel && !!onAction && (
        <Button label={actionLabel} onPress={onAction} variant="secondary" style={styles.action} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing['2xl'],
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  action: {
    marginTop: spacing.xl,
    alignSelf: 'center',
    paddingHorizontal: spacing['3xl'],
  },
});
