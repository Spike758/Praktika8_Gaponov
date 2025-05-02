import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchCharacters } from '../../api';

export default function CharactersScreen() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacters()
      .then(data => setCharacters(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>Status: {item.status}</Text>
      <Text style={styles.description}>Species: {item.species}</Text>
      <Text style={styles.description}>Location: {item.location.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={characters}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#3a7ff0',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
  },
  description: {
    color: '#fff',
  }
});
