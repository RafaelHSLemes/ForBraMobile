import { Server, Socket } from 'socket.io';

const chatHandler = (socket: Socket, io: Server) => {
  // Listener para entrada em uma sala de chat
  socket.on('joinRoom', (room: string) => {
    socket.join(room);
    console.log(`Usuário entrou na sala: ${room}`);
  });

  // Listener para enviar mensagem
  socket.on('sendMessage', ({ room, message }) => {
    io.to(room).emit('receiveMessage', message);
    console.log(`Mensagem enviada para a sala ${room}: ${message}`);
  });

  // Listener para desconectar
  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
};

export default chatHandler;