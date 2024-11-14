// src/components/MapComponent.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiltersType } from '../types/filters';

interface MapComponentProps {
  filters: FiltersType;
  onStartChat: (userId: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ filters, onStartChat }) => {
  const position: LatLngExpression = [-23.55052, -46.633308]; // São Paulo, Brasil

  return (
    <View style={styles.mapContainer}>
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} eventHandlers={{ click: () => onStartChat('123') }}>
          <Popup>Bem-vindo a São Paulo! Filtros: {JSON.stringify(filters)}</Popup>
        </Marker>
      </MapContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MapComponent;