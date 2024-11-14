// screens/ProfileScreen.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#32CD32',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 10,
  },
  mapLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E90FF', // Usando a cor azul para destacar
    marginTop: 20,
    marginBottom: 10,
  },
});

export default styles;