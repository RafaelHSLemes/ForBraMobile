import express from 'express'; // Importação correta quando esModuleInterop = true
import { Request, Response, NextFunction } from 'express';
import * as http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import * as path from 'path'
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import chatHandler from './controllers/chatController';
import UserModel from './schemas/UserModel';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Variáveis de ambiente
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';
const JWT_SECRET = process.env.JWT_SECRET;

// Validação das variáveis de ambiente obrigatórias
if (!MONGO_URI) {
  console.error('Erro: MONGO_URI não configurado.');
  process.exit(1);
}
if (!JWT_SECRET) {
  console.error('Erro: JWT_SECRET não configurado.');
  process.exit(1);
}

// Middlewares globais
app.use(cors());
app.use(express.json()); // Substitui o body-parser

// Conexão com o MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso no banco:', MONGO_URI);
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

// Middleware para registrar detalhes das requisições recebidas
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Função de registro no controlador
export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, senha, localizacao, profissao, interesses } = req.body;

  if (!nome || !email || !senha || !localizacao || !profissao || !interesses) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verificar se o usuário já existe
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado.' });
    }

    // Criar usuário
    const user = new UserModel({
      nome,
      email,
      senha: await bcrypt.hash(senha, 10),
      localizacao,
      profissao,
      interesses,
    });

    //Salvar no banco
    await user.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário.', error });
  }
};

// Rotas de usuários com prefixo "/api/users"
app.use('/api/users', userRoutes);

// Middleware para tratar erros de rota desconhecida
app.use((req: Request, res: Response) => {
  console.log(`Rota desconhecida acessada: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Configuração do Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Registrar dados do cliente no log
  socket.on('identificar', (dados) => {
    console.log(`Identificação recebida de ${socket.id}:`, dados);
  });

  // Lida com eventos de chat
  chatHandler(socket, io);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, 'coverage', 'Icov-report');
  app.use(express.static(staticPath));

  app.get('*', (req: Request, res: Response) => {
    console.log(`Servindo arquivo estático para rota: ${req.url}`);
    res.sendFile(path.resolve(staticPath, 'index.html'));
    console.log(req.body);
  });
}

// Inicialização do servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;