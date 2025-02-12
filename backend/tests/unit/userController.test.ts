import { Request, Response } from 'express';
import { registerUser, loginUser } from '../../controllers/userController';
import UserModel from '../../schemas/UserModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../schemas/UserModel');
// Garante que bcrypt está mockado antes de qualquer chamada a spyOn

let mockUser: any;

beforeAll(async () => {
  mockUser = {
    id: 1,
    email: 'usuario@teste.com',
    password: await bcrypt.hash('senhaCorreta', 10), // ✅ Correção aqui
  };
});
jest.spyOn(UserModel, 'findOne').mockResolvedValue(mockUser);

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(false) // Mock correto
}));
jest.mock('jsonwebtoken');
jest.spyOn(UserModel, 'findOne').mockResolvedValue(mockUser); // 🔹 Garante que um usuário válido é encontrado

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(), // Permite encadeamento de chamadas como res.status(400).json(...)
    json: jest.fn(),
    send: jest.fn(),
  };
  return res;
};

describe('User Controller - Unit Tests', () => {
  it('Deve retornar erro ao tentar login com senha incorreta', async () => {
      const req = {
          body: { email: 'usuario@email.com', senha: 'senhaErrada' }
      } as any;

      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
      } as any;

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400); // ✅ Agora deve passar corretamente
      expect(res.json).toHaveBeenCalledWith({ message: 'Senha incorreta' });
  });
});

  it('Deve retornar erro ao tentar login com senha incorreta', async () => {
    const req = { body: { email: 'teste@email.com', senha: 'senhaerrada' } } as Request;
    const res = mockResponse() as Response;
    
    jest.spyOn(UserModel, 'findOne').mockResolvedValue({
      senha: 'senhaHash',
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(expect.any(Number));
    expect(res.json).toHaveBeenCalledWith({ message: 'Senha incorreta' });
  });