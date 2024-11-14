// src/screens/ExploreNearbyScreen.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E90FF', // Destaque para a cor azul
    marginBottom: 10,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default styles;