import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../schemas/UserModel';
import { getCoordinatesFromAddress } from '../utils/geocode';
import { buscarUsuarioPorEmail } from '../service/userService';

// Cadastro de Usuário
export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, senha, endereco, profissao, interesses } = req.body;

  try {
    // Validação de campos obrigatórios
    if (!nome || !email || !senha || !endereco || !profissao || !interesses) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    // Verificar se o usuário já existe
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado.' });
    }

    // Obter coordenadas do endereço
    const localizacao = await getCoordinatesFromAddress(endereco);
    if (!localizacao) {
      return res.status(400).json({ message: 'Endereço inválido ou não encontrado.' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar novo usuário
    const user = new UserModel({
      nome,
      email,
      senha: hashedPassword,
      endereco,
      localizacao,
      profissao,
      interesses, // Permitir duplicatas conforme solicitado
    });

    const savedUser = await user.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso.', user: savedUser });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor.', error });
  }
};

// Login de Usuário
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Gerar token de autenticação
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // Retornar o token
    res.json({ message: 'Login realizado com sucesso', token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
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