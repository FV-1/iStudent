import { View, Text, StyleSheet, ScrollView , Image} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';



type EventContainerProps = {
  title?: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
};

export default function EventContainer({
  title = "Evenement non défini",
  description = "Aucune description disponible pour cet événement.",
  imageUrl,
  tags = [],
}: EventContainerProps) {

  return (
    <ThemedView style={styles.page}>
      <ScrollView style={styles.scroll}>
        <View style={styles.eventCard}>
          <Image
            source={require('../assets/images/musique.png')}
            style={styles.Image}
            resizeMode="cover"
          />

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Gratuit</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Musique</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 5,
  },
  scroll: {
    flex: 1,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  icon: {
    width: 50,
    alignSelf: 'stretch',
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#ddd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
  Image: {
    width: 50,
    alignSelf: 'stretch',
    marginRight: 12,
    borderRadius: 12,
    height: 50,
  },
});

