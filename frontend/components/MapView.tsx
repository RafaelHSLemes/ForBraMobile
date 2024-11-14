import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface MarkerData {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
}

interface OpenStreetMapViewProps {
  markers?: MarkerData[];
  onRegionChangeComplete?: (region: Region) => void;
  initialRegion?: Region;
}

const OpenStreetMapView: React.FC<OpenStreetMapViewProps> = ({ markers = [], onRegionChangeComplete, initialRegion }) => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLoading(false);
      },
      error => {
        console.error('Erro ao obter localização:', error);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#1E90FF" />;
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={initialRegion || {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          onRegionChangeComplete={onRegionChangeComplete}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Você está aqui"
          />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
      ) : (
        <Text>Obtendo localização...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default OpenStreetMapView;