// AudioControls.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AudioControls from '../AudioControls';

describe('AudioControls', () => {
  it('deve renderizar o botão com o texto correto dependendo do estado "isMuted"', () => {
    const mockOnToggleMute = jest.fn();

    const { getByText, rerender } = render(
      <AudioControls onToggleMute={mockOnToggleMute} isMuted={false} />
    );

    // Verifica se o botão exibe "Mutar" quando `isMuted` é falso
    expect(getByText('Mutar')).toBeTruthy();

    // Atualiza a renderização para o caso de `isMuted` verdadeiro
    rerender(<AudioControls onToggleMute={mockOnToggleMute} isMuted={true} />);

    // Verifica se o botão exibe "Desmutar" quando `isMuted` é verdadeiro
    expect(getByText('Desmutar')).toBeTruthy();
  });

  it('deve chamar a função onToggleMute quando o botão é pressionado', () => {
    const mockOnToggleMute = jest.fn();
    const { getByText } = render(
      <AudioControls onToggleMute={mockOnToggleMute} isMuted={false} />
    );

    const button = getByText('Mutar');
    fireEvent.press(button);

    // Verifica se a função foi chamada ao pressionar o botão
    expect(mockOnToggleMute).toHaveBeenCalled();
  });

  it('deve aplicar a cor correta ao botão dependendo do estado "isMuted"', () => {
    const mockOnToggleMute = jest.fn();
    const { getByTestId, rerender } = render(
      <AudioControls onToggleMute={mockOnToggleMute} isMuted={false} />
    );

    // Verifica a cor quando `isMuted` é falso
    const button = getByTestId('mute-button');
    expect(button.props.style.backgroundColor).toBe('#FFD700');

    // Atualiza a renderização para o caso de `isMuted` verdadeiro
    rerender(<AudioControls onToggleMute={mockOnToggleMute} isMuted={true} />);
    const buttonMuted = getByTestId('mute-button');

    // Verifica a cor quando `isMuted` é verdadeiro
    expect(buttonMuted.props.style.backgroundColor).toBe('#32CD32');
  });
});