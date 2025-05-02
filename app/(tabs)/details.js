import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';

export default function DetailsScreen() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const [data, setData] = useState(null);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingResidents, setLoadingResidents] = useState(false);

  useEffect(() => {
    if (params.id && params.type) {
      setLoading(true);
      fetch(`https://rickandmortyapi.com/api/${params.type}/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setData(data);
          setLoading(false);
          
          // Загружаем резидентов для локаций
          if (params.type === 'location' && data.residents?.length > 0) {
            setLoadingResidents(true);
            const residentIds = data.residents
              .map(url => url.split('/').pop())
              .join(',');
            
            fetch(`https://rickandmortyapi.com/api/character/[${residentIds}]`)
              .then(res => res.json())
              .then(data => {
                setResidents(Array.isArray(data) ? data : [data]);
                setLoadingResidents(false);
              });
          }
        });
    }
  }, [params.id, params.type]);

  if (loading || !data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: params.name || data.name }} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{data.name}</Text>
        {params.type === 'episode' && (
          <Text style={[styles.subtitle, { color: colors.tint }]}>{data.episode}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
        
        {params.type === 'episode' ? (
          <>
            <DetailRow label="Air Date:" value={data.air_date} colors={colors} />
            <DetailRow label="Created:" value={new Date(data.created).toLocaleDateString()} colors={colors} />
          </>
        ) : (
          <>
            <DetailRow label="Type:" value={data.type} colors={colors} />
            <DetailRow label="Dimension:" value={data.dimension} colors={colors} />
            <DetailRow label="Created:" value={new Date(data.created).toLocaleDateString()} colors={colors} />
          </>
        )}
      </View>

      {params.type === 'episode' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Characters ({data.characters?.length || 0})
          </Text>
          {loadingResidents ? (
            <ActivityIndicator color={colors.tint} />
          ) : (
            data.characters?.map((characterUrl, index) => {
              const characterId = characterUrl.split('/').pop();
              return (
                <Link 
                  key={index} 
                  href={`/character?id=${characterId}`}
                  style={[styles.characterLink, { backgroundColor: colors.cardBackground }]}
                >
                  <Text style={[styles.characterText, { color: colors.tint }]}>
                    Character #{characterId}
                  </Text>
                </Link>
              );
            })
          )}
        </View>
      )}

      {params.type === 'location' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Residents ({residents.length || 0})
          </Text>
          {loadingResidents ? (
            <ActivityIndicator color={colors.tint} />
          ) : residents.length > 0 ? (
            residents.map(character => (
              <Link 
                key={character.id}
                href={`/character?id=${character.id}`}
                style={[styles.characterLink, { backgroundColor: colors.cardBackground }]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image 
                    source={{ uri: character.image }} 
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                  />
                  <View>
                    <Text style={[styles.characterText, { color: colors.text }]}>
                      {character.name}
                    </Text>
                    <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                      {character.species} • {character.status}
                    </Text>
                  </View>
                </View>
              </Link>
            ))
          ) : (
            <Text style={{ color: colors.secondaryText }}>No residents found</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function DetailRow({ label, value, colors }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value || 'Unknown'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 120,
    fontWeight: '600',
  },
  detailValue: {
    flex: 1,
  },
  characterLink: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  characterText: {
    fontSize: 16,
  },
});