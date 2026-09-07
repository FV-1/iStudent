import { Stack, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { useTheme } from '@/theme';

export default function NotFoundScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Oups !' }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          icon="help-circle-outline"
          title="Cette page n’existe pas"
          description="Le lien que vous avez suivi ne mène nulle part."
          actionLabel="Retour à la carte"
          onAction={() => router.replace('/')}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
