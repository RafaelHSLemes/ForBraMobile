import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

// Função para gerar uma chave secreta criptograficamente segura de 32 caracteres
const generateSecretKey = (): string => {
  // Gera 32 bytes aleatórios e os converte para uma string hexadecimal (64 caracteres)
  return randomBytes(32).toString('hex');
};

// Define a chave secreta usando uma variável de ambiente ou gerando uma nova chave segura
let secretKey = process.env.JWT_SECRET || generateSecretKey();

// Função para obter a chave secreta do JWT
export const getJwtSecret = (): string => {
  return secretKey;
};

// Função para gerar um token JWT
export const generateToken = (userId: string, profissao: string) => {
  return jwt.sign({ id: userId, profissao }, getJwtSecret(), { expiresIn: '1h' });
};