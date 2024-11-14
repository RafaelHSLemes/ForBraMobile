// ExploreNearbyScreen.tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import MapComponent from '../../components/MapComponent';
import FilteredSearchComponent from '../../components/FilteredSearchComponent';
import styles from './ExploreNearbyScreen.styles';
import { FiltersType } from '../../types/filters'; // Importando o tipo

const ExploreNearbyScreen: React.FC = () => {
  const [filters, setFilters] = useState<FiltersType>({
    type: '', // Inicialização da propriedade type
    rating: 0, // Inicialização da propriedade rating
  });

  const handleFiltersChange = (newFilters: FiltersType) => {
    setFilters({
      profession: newFilters.profession,
      interests: newFilters.interests?.map(item => item.trim()) || [],
      type: newFilters.type,
      rating: newFilters.rating,
    });
  };

  const handleStartChat = (userId: string) => {
    // Navegar para a tela de chat com o userId
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários Próximos</Text>
      <FilteredSearchComponent onFiltersChange={handleFiltersChange} />
      <MapComponent onStartChat={handleStartChat} filters={filters} />
    </View>
  );
};

export default ExploreNearbyScreen;