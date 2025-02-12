import express, { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  findNearbyUsers,
  filterUsers,
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// Teste de saúde para a rota principal
router.get('/test', (req: Request, res: Response) => {
  console.log(`[TESTE] Requisição recebida: ${req.method} ${req.url}`);
  res.status(200).json({
    message: 'Rota de teste funcionando.',
    headers: req.headers,
  });
});

// Rota para registrar um novo usuário
router.post('/register', async (req: Request, res: Response) => {
  console.log(`[REGISTER] Dados recebidos:`, req.body);
  await registerUser(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
  console.log(`[LOGIN] Tentativa de login para o e-mail: ${req.body?.email}`);
  await loginUser(req, res);
});

// Rota para encontrar usuários próximos
router.get('/nearby', authMiddleware, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  console.log(`[NEARBY] Usuário autenticado: ${req.user.id}`);
  findNearbyUsers(req, res);
});

// Rota para filtrar usuários baseados em interesses e profissão
router.get('/filter', authMiddleware, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  console.log(`[FILTER] Usuário autenticado: ${req.user.id}`);
  filterUsers(req, res);
});

export default router;