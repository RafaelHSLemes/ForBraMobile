// screens/HomeScreen/HomeScreen.tsx

import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import FilteredSearchComponent from '../../components/FilteredSearchComponent';
import MapComponent from '../../components/MapComponent';
import styles from './HomeScreen.styles';
import { FiltersType } from '../../types/filters';

type RootStackParamList = {
  Home: undefined;
  Chat: { userId: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [filters, setFilters] = useState<FiltersType>({
    type: 'default',
    rating: 0,
    profession: '',
    interests: [],
  });

  const handleStartChat = (userId: string) => {
    navigation.navigate('Chat', { userId });
  };

  const handleFiltersChange = (newFilters: FiltersType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      profession: newFilters.profession || '',
      interests: newFilters.interests ? newFilters.interests.map(item => item.trim()) : [],
      type: newFilters.type || prevFilters.type,
      rating: newFilters.rating || prevFilters.rating,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FilteredSearchComponent onFiltersChange={handleFiltersChange} />
      <MapComponent onStartChat={handleStartChat} filters={filters} />
    </ScrollView>
  );
};

export default HomeScreen;