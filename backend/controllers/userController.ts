import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../schemas/UserModel';

// Cadastro de Usuário
export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, senha, localizacao, profissao, interesses } = req.body;

  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = new UserModel({
      nome,
      email,
      senha: hashedPassword,
      localizacao,
      profissao,
      interesses,
    });

    await user.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
  }
};

// Login de Usuário
export const loginUser = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

// Busca de Usuários Próximos
export const findNearbyUsers = async (req: Request, res: Response) => {
  const { latitude, longitude, maxDistance = 5000 } = req.query; // Distância em metros

  try {
    const users = await UserModel.find({
      'localizacao.latitude': { $gt: Number(latitude) - 0.05, $lt: Number(latitude) + 0.05 },
      'localizacao.longitude': { $gt: Number(longitude) - 0.05, $lt: Number(longitude) + 0.05 },
    }).exec();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários próximos', error });
  }
};

// Filtragem de Usuários por Profissão e Interesses
export const filterUsers = async (req: Request, res: Response) => {
  const { profissao, interesses } = req.query;

  try {
    const query: any = {};
    if (profissao) query.profissao = profissao;
    if (interesses) query.interesses = { $in: interesses };

    const users = await UserModel.find(query).exec();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao filtrar usuários', error });
  }
};