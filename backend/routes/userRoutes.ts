import express from 'express';
import { registerUser, loginUser, findNearbyUsers, filterUsers } from '../controllers/userController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', registerUser);

// Rota para autenticação (login do usuário)
router.post('/login', loginUser);

// Rota para encontrar usuários próximos, protegida pelo middleware de autenticação
router.get('/nearby', authMiddleware, findNearbyUsers);

// Rota para filtrar usuários baseados em interesses e profissão, também protegida
router.get('/filter', authMiddleware, filterUsers);

export default router;