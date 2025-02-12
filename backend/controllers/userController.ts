import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import UserModel from '../schemas/UserModel';
import { getCoordinatesFromAddress } from '../utils/geocode';
import { buscarUsuarioPorEmail } from '../service/userService';

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
      interesses,
    });

    const savedUser = await user.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso.', user: savedUser });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
};

// Login de Usuário
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ where: { email } });

    if (!user || !user.senha) { // Certifica que temos um usuário válido e com senha
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }    
    
    const senhaCorreta = await bcrypt.compare(password, user.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ message: 'Senha incorreta' }); // 🔹 Agora o erro será retornado corretamente
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login realizado com sucesso', token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

// Busca de Usuários Próximos
export const findNearbyUsers = async (req: Request, res: Response) => {
  const { latitude, longitude, maxDistance = 5000 } = req.query;

  try {
    const users = await UserModel.find({
      'localizacao.latitude': { $gt: Number(latitude) - 0.05, $lt: Number(latitude) + 0.05 },
      'localizacao.longitude': { $gt: Number(longitude) - 0.05, $lt: Number(longitude) + 0.05 },
    }).exec();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários próximos', error: error.message });
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
    res.status(500).json({ message: 'Erro ao filtrar usuários', error: error.message });
  }
};