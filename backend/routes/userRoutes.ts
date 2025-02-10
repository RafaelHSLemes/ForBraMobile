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
    headers: req.headers, // Log opcional dos cabeçalhos
  });
});

// Rota para registrar um novo usuário
router.post('/register', (req: Request, res: Response) => {
  console.log(`[REGISTER] Dados recebidos:`, req.body);
  registerUser(req, res); // Passa o objeto `req` para o controlador
});

// Rota para autenticação (login do usuário)
router.post('/login', (req: Request, res: Response) => {
  console.log(`[LOGIN] Tentativa de login para o e-mail: ${req.body?.email}`);
  loginUser(req, res); // Chama o controlador com o `req` completo
});

// Rota para encontrar usuários próximos, protegida pelo middleware de autenticação
router.get('/nearby', authMiddleware, (req: Request, res: Response) => {
  console.log(
    `[NEARBY] Requisição autenticada para encontrar usuários próximos. Usuário: ${
      req.user.id || 'Desconhecido'
    }`
  );
  console.log('Parâmetros da query:', req.query); // Captura os parâmetros de consulta
  findNearbyUsers(req, res);
});

// Rota para filtrar usuários baseados em interesses e profissão, também protegida
router.get('/filter', authMiddleware, (req: Request, res: Response) => {
  console.log(`[FILTER] Usuário autenticado: ${req.user.id}`);
  console.log(
    `Parâmetros para filtro: interesses = ${req.query.interesses}, profissão = ${req.query.profissao}`
  );

  // Valida parâmetros opcionais e adiciona mensagens de log úteis
  if (!req.query.interesses && !req.query.profissao) {
    console.warn(`[FILTER] Nenhum parâmetro de filtro fornecido.`);
  }

  filterUsers(req, res);
});

export default router;