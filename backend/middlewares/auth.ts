import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../utils/jwtUtils'; // Importa a função para obter a chave secreta do JWT

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    (req as any).user = decoded; // Adiciona o usuário decodificado ao objeto de requisição
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Acesso negado. Token inválido ou expirado.' });
  }
};