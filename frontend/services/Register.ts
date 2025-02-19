import axios from 'axios';

const getCoordinates = async (address: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
        const apiKey = 'SUA_CHAVE_GOOGLE_MAPS';
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address: address,
                key: apiKey,
            },
        });

        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return { latitude: location.lat, longitude: location.lng };
        } else {
            throw new Error('Endereço não encontrado ou inválido');
        }
    } catch (error) {
        const err = error as Error;
        console.log(err.message);
        return null; // Corrige o erro ao garantir retorno
    }
};

export const geocodeAddress = async (
    street: string,
    houseNumber: string,
    neighborhood: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
) => {
    const fullAddress = `${street}, ${houseNumber}, ${neighborhood}, ${city}, ${state}, ${country}, ${zipCode}`;
    return await getCoordinates(fullAddress);
};

export const handleRegister = async (
    nome: string,
    email: string,
    senha: string,
    endereco: string,
    profissao: string,
    interesses: string[]
) => {
    try {
        const coordinates = await getCoordinates(endereco);
        if (!coordinates) {
            throw new Error('Não foi possível obter a localização.');
        }

        const userData = {
            nome,
            email,
            senha,
            profissao,
            localizacao: {
                type: 'Point',
                coordinates: [coordinates.longitude, coordinates.latitude],
            },
            interesses,
        };

        const response = await axios.post('http://localhost:3000/register', userData);

        if (response.status !== 200) {
            throw new Error('Erro ao registrar usuário.');
        }

        return { success: true, message: 'Usuário registrado com sucesso!' };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
};