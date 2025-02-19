import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());
app.use(express.json());

interface Post {
    id: string;
    user: string;
    profilePic: string;
    content: string;
    mediaUrl?: string;
    type: 'text' | 'image' | 'video' | 'audio';
    timestamp: number;
}

const posts: Post[] = [];

io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    socket.emit('initialPosts', posts);

    socket.on('newPost', (post: Post) => {
        posts.unshift(post); // Adiciona o post no início da lista
        io.emit('newPost', post);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});