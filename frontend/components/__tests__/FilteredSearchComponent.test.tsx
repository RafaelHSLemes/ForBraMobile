// components/__tests__/FilteredSearchComponent.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilteredSearchComponent from '../FilteredSearchComponent';

describe('FilteredSearchComponent', () => {
  const mockOnFiltersChange = jest.fn();

  beforeEach(() => {
    mockOnFiltersChange.mockClear();
  });

  it('deve chamar onFiltersChange quando filtros mudarem', () => {
    const { getByPlaceholderText } = render(
      <FilteredSearchComponent onFiltersChange={mockOnFiltersChange} />
    );

    // Localizando e alterando o campo de profissão
    const professionInput = getByPlaceholderText('Profissão');
    fireEvent.changeText(professionInput, 'Desenvolvedor');

    // Verificando se a função foi chamada com o valor correto
    expect(mockOnFiltersChange).toHaveBeenCalledWith({ profession: 'Desenvolvedor', interests: '' });

    // Localizando e alterando o campo de interesses
    const interestsInput = getByPlaceholderText('Interesses (separados por vírgula)');
    fireEvent.changeText(interestsInput, 'React, Node.js');

    // Verificando novamente se a função foi chamada com os valores atualizados
    expect(mockOnFiltersChange).toHaveBeenCalledWith({ profession: 'Desenvolvedor', interests: 'React, Node.js' });
  });
});