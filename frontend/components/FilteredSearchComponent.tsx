// components/FilteredSearchComponent.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FiltersType } from '../types/filters'; // Importando o tipo

interface Props {
  onFiltersChange: (filters: FiltersType) => void;
}

const FilteredSearchComponent: React.FC<Props> = ({ onFiltersChange }) => {
  const [profession, setProfession] = useState('');
  const [interests, setInterests] = useState('');
  const [type, setType] = useState('');
  const [rating, setRating] = useState<number>(0);

  const handleProfessionChange = (text: string) => {
    setProfession(text);
    onFiltersChange({ profession: text, interests: interests.split(','), type, rating });
  };

  const handleInterestsChange = (text: string) => {
    setInterests(text);
    onFiltersChange({ profession, interests: text.split(','), type, rating });
  };

  const handleTypeChange = (text: string) => {
    setType(text);
    onFiltersChange({ profession, interests: interests.split(','), type: text, rating });
  };

  const handleRatingChange = (text: string) => {
    const newRating = parseFloat(text);
    setRating(newRating);
    onFiltersChange({ profession, interests: interests.split(','), type, rating: newRating });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Profissão"
        value={profession}
        onChangeText={handleProfessionChange}
        style={styles.input}
      />
      <TextInput
        placeholder="Interesses (separados por vírgula)"
        value={interests}
        onChangeText={handleInterestsChange}
        style={styles.input}
      />
      <TextInput
        placeholder="Tipo"
        value={type}
        onChangeText={handleTypeChange}
        style={styles.input}
      />
      <TextInput
        placeholder="Rating"
        value={rating.toString()}
        onChangeText={handleRatingChange}
        style={styles.input}
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
  },
});

export default FilteredSearchComponent;
