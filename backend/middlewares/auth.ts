// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../utils/jwtUtils'; // Importa a função para obter a chave secreta do JWT

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token inválido' });
  }
};