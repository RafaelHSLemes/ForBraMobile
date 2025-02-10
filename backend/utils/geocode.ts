import axios from 'axios';

export const getCoordinatesFromAddress = async (address: string): Promise<{ latitude: number; longitude: number } | null> => {
  const API_KEY = process.env.POSITION_STACK_API_KEY; // Defina a chave no .env
  if (!API_KEY) throw new Error('Position Stack API Key não configurada.');

  const url = `http://api.positionstack.com/v1/forward`;
  try {
    const response = await axios.get(url, {
      params: {
        access_key: '4d9ddcc9b7ea6b601550fa91f642fa9d',
        query: address,
        limit: 1, // Pega apenas a primeira correspondência
      },
    });

    const data = response.data.data[0];
    if (data) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter coordenadas:', error);
    throw new Error('Falha na geocodificação do endereço.');
  }
};