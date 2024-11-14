import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import VideoCall from '../VideoCall'; // Certifique-se de que o caminho esteja correto

jest.mock('react-native-webrtc', () => {
  return {
    RTCView: jest.fn(() => null),
    MediaStream: jest.fn(() => ({
      toURL: jest.fn(),
      getTracks: jest.fn(() => []),
    })),
    RTCPeerConnection: jest.fn(() => ({
      addTrack: jest.fn(),
      close: jest.fn(),
      createOffer: jest.fn(() => Promise.resolve({ sdp: 'fake-sdp', type: 'offer' })),
      createAnswer: jest.fn(() => Promise.resolve({ sdp: 'fake-sdp', type: 'answer' })),
      setLocalDescription: jest.fn(() => Promise.resolve()),
      setRemoteDescription: jest.fn(() => Promise.resolve()),
      addEventListener: jest.fn(),
      getReceivers: jest.fn(() => []),
    })),
  };
});

describe('VideoCall Component', () => {
  it('should render correctly and handle call actions', () => {
    const { getByText } = render(<VideoCall />);
    
    // Simular o clique no botão de encerrar chamada
    const endCallButton = getByText('Encerrar Chamada');
    fireEvent.press(endCallButton);

    // Verificar se o botão foi renderizado corretamente
    expect(endCallButton).toBeTruthy();
  });
});