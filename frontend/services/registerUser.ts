// registerUser.ts
import axios from 'axios';

// URL base da API
const API_URL = 'http://localhost:3000/register';

/**
 * Função para registrar um novo usuário.
 * @param name - Nome do usuário
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @param localizacao - Localização do usuário
 * @param profissao - Profissão do usuário
 * @param interesses - Interesses do usuário
 * @param localizacao - Coordenadas do usuário
 * @returns Resposta da API ou erro
 */
export const registerUser = async ({
  name,
  email,
  password,
  localization,
  profession,
  interests,
}: {
  name: string;
  email: string;
  password: string;
  localization: { latitude: number; longitude: number };
  profession: string;
  interests: string[];
}): Promise<any> => {
  try {
    // Exemplo de requisição para uma API REST
    const response = await fetch('https://localhost:8081/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        localization,
        profession,
        interests,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || 'Erro ao salvar no banco de dados' };
    }

    return await response.json(); // Retorna o usuário criado ou outra resposta esperada
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};