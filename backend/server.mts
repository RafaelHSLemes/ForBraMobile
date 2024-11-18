import express, { Request, Response } from 'express'; // Importação correta dos tipos
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.ts';
import chatHandler from './controllers/chatController';
import { getJwtSecret } from './utils/jwtUtils'; // Importa a função para obter a chave secreta do JWT
import dotenv from 'dotenv';

dotenv.config();
const jsonParser = bodyParser.json();
const app = express(); // Certifique-se de instanciar o express
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Middlewares
app.use(cors());
//app.use(json());

console.log(process.env.MONGO_URI)

// Conecta ao MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Modelo de Usuário
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profession: { type: String, required: true },
  interests: [String],
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { 
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
}, { timestamps: true });

// Índice geoespacial
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

// Endpoint para atualizar localização do usuário
app.post('/api/update-location', async (req: Request, res: Response) => {
  const { latitude, longitude } = req.body;
  const userId = req.headers['x-user-id'] as string; // Exemplo de obtenção do ID do usuário

  if (!userId) {
    return res.status(400).json({ message: 'ID do usuário não fornecido' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Localização atualizada com sucesso', user });
  } catch (error) {
    console.error('Erro ao atualizar localização:', error);
    res.status(500).json({ message: 'Erro ao atualizar localização' });
  }
});

// Endpoint para buscar usuários próximos
app.get('/api/nearby-users', async (req: Request, res: Response) => {
  const { latitude, longitude, radius } = req.query;

  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ message: 'Parâmetros insuficientes' });
  }

  const radiusInMeters = parseFloat(radius as string);

  try {
    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)],
          },
          $maxDistance: radiusInMeters,
        },
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários próximos:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários próximos' });
  }
});

// Rotas
app.use('/api/users', userRoutes);

// Configuração do Socket.IO para chat
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');
  chatHandler(socket, io);
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;