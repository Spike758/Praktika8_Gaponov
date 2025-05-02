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

export default function LocationsScreen() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/location')
      .then((res) => res.json())
      .then((data) => {
        setLocations(data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load locations');
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
          type: 'location',
          name: item.name 
        }
      })}
    >
      <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
      <Text style={{ color: colors.secondaryText }}>Type: {item.type}</Text>
      <Text style={{ color: colors.secondaryText }}>Dimension: {item.dimension}</Text>
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
      data={locations}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <Text style={[styles.empty, { color: colors.text }]}>
          No locations found
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