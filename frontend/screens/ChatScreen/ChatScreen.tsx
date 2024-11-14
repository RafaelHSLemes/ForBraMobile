// ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './ChatScreen.styles';

interface Message {
  userId: string;
  message: string;
  timestamp: string;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [userId, setUserId] = useState<string>('');
  const roomId = 'salaExemplo'; // Pode ser dinâmico baseado em com quem o usuário está conversando

  useEffect(() => {
    const initializeSocket = async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
      setUserId(user._id);

      const newSocket = io('http://localhost:3000', {
        auth: {
          token,
        },
      });

      newSocket.emit('joinRoom', roomId);

      newSocket.on('chatMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      newSocket.on('userJoined', ({ userId }) => {
        // Pode exibir uma mensagem de usuário entrou
      });

      newSocket.on('userLeft', ({ userId, timestamp }) => {
        // Pode exibir "visto por último às"
      });

      newSocket.on('userJoined', ({ userId }) => {
        if (userId !== userId) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              userId: 'system',
              message: `Usuário ${userId} entrou no chat`,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      });
      
      newSocket.on('userLeft', ({ userId, timestamp }) => {
        if (userId !== userId) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              userId: 'system',
              message: `Usuário ${userId} saiu do chat. Visto por último às ${new Date(timestamp).toLocaleTimeString()}`,
              timestamp,
            },
          ]);
        }
      });

      setSocket(newSocket);
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.emit('leaveRoom', roomId);
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      socket.emit('chatMessage', { roomId, message: inputMessage });
      setInputMessage('');
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.userId === userId ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageTimestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Digite sua mensagem"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;