// MapComponent.test.tsx
/*import React from 'react';
import { render } from '@testing-library/react-native';
import MapComponent from '../MapComponent'; // Certifique-se de que o caminho está correto
import Geolocation from 'react-native-geolocation-service';

// Mocking react-native-maps
jest.mock('react-native-maps', () => {
  const MockMapView = jest.fn(() => null);
  const MockMarker = jest.fn(() => null);

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

// Mocking Geolocation
jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn((success, error) => {
    success({
      coords: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
    });
  }),
}));

describe('MapComponent', () => {
  it('renders correctly with filters', () => {
    const props = {
      filters: {
        type: 'restaurant',
        rating: 4,
      },
    };

    const { getByText } = render(<MapComponent {...props} />);
    // Verifica se algum texto específico do componente é exibido corretamente
    expect(getByText('restaurant')).toBeTruthy();
  });
});*/