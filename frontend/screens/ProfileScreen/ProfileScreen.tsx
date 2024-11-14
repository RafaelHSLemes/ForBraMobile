// screens/ProfileScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import OpenStreetMapView from '../../components/MapView';
import styles from './ProfileScreen.styles';

interface ProfileScreenProps {
  route: {
    params: {
      name: string;
      profession: string;
      interests: string[];
    };
  };
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route }) => {
  const { name, profession, interests } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.info}>{name}</Text>
      <Text style={styles.label}>Profissão:</Text>
      <Text style={styles.info}>{profession}</Text>
      <Text style={styles.label}>Interesses:</Text>
      <Text style={styles.info}>{interests.join(', ')}</Text>
      <Text style={styles.mapLabel}>Localização Aproximada:</Text>
      <OpenStreetMapView />
    </View>
  );
};

export default ProfileScreen;