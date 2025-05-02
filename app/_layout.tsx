import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="characters" options={{ title: 'Characters' }} />
      <Tabs.Screen name="locations" options={{ title: 'Locations' }} />
      <Tabs.Screen name="episodes" options={{ title: 'Episodes' }} />
    </Tabs>
  );
}
