import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function EpisodesScreen() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/episode')
      .then((res) => res.json())
      .then((data) => {
        setEpisodes(data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load episodes');
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBackground }]}
      onPress={() => router.push({
        pathname: '/details',
        params: { 
          id: item.id,
          type: 'episode',
          name: item.name 
        }
      })}
    >
      <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
      <Text style={{ color: colors.secondaryText }}>Episode: {item.episode}</Text>
      <Text style={{ color: colors.secondaryText }}>Air Date: {item.air_date}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={episodes}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <Text style={[styles.empty, { color: colors.text }]}>
          No episodes found
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: '#3a7ff0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  descripiton: {
    color: '#fff',
  }
});