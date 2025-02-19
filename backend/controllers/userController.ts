import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import UserModel from '../schemas/UserModel';
import { getCoordinatesFromAddress } from '../utils/geocode';

// Cadastro de Usuário
export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, senha, endereco, profissao, interesses } = req.body;

  try {
    if (!nome || !email || !senha || !endereco || !profissao || !interesses) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado.' });
    }

    const localizacao = await getCoordinatesFromAddress(endereco);
    if (!localizacao) {
      return res.status(400).json({ message: 'Endereço inválido ou não encontrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = new UserModel({
      nome,
      email,
      senha: hashedPassword,
      endereco,
      localizacao,
      profissao,
      interesses: Array.isArray(interesses) ? interesses : [interesses],
    });

    const savedUser = await user.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso.', user: savedUser });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Erro interno do servidor.', error: err.message });
  }
};

// Login de Usuário
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user || !user.senha) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(password, user.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não está definido.');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login realizado com sucesso', token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Erro ao fazer login', error: err.message });
  }
};

// Busca de Usuários Próximos
export const findNearbyUsers = async (req: Request, res: Response) => {
  const { latitude, longitude, maxDistance = 5000 } = req.query;

  try {
    const lat = Number(latitude);
    const lon = Number(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ message: 'Parâmetros de localização inválidos.' });
    }

    const users = await UserModel.find({
      'localizacao.latitude': { $gt: lat - 0.05, $lt: lat + 0.05 },
      'localizacao.longitude': { $gt: lon - 0.05, $lt: lon + 0.05 },
    }).exec();

    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários próximos:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Erro ao buscar usuários próximos', error: err.message });
  }
};

// Filtragem de Usuários por Profissão e Interesses
export const filterUsers = async (req: Request, res: Response) => {
  const { profissao, interesses } = req.query;

  try {
    const query: any = {};
    if (profissao) query.profissao = profissao;
    if (interesses) query.interesses = { $in: Array.isArray(interesses) ? interesses : [interesses] };

    const users = await UserModel.find(query).exec();
    res.json(users);
  } catch (error) {
    console.error('Erro ao filtrar usuários:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Erro ao filtrar usuários', error: err.message });
  }
};