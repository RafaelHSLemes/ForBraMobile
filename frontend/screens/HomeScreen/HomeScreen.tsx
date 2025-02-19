import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { io } from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import styles from './HomeScreen.styles';

const socket = io('http://localhost:3000');

interface Post {
  id: string;
  user: string;
  profilePic: string;
  content: string;
  mediaUrl?: string;
  type: 'text' | 'image' | 'video' | 'audio';
  timestamp: number;
}

const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [type, setType] = useState<'text' | 'image' | 'video' | 'audio'>('text');

  useEffect(() => {
    socket.on('initialPosts', (initialPosts: Post[]) => {
      setPosts(initialPosts);
    });

    socket.on('newPost', (post: Post) => {
      setPosts((prevPosts) => [post, ...prevPosts]);
    });

    return () => {
      socket.off('initialPosts');
      socket.off('newPost');
    };
  }, []);

  const handleSend = () => {
    if (!text.trim() && !mediaUrl) return;

    const newPost: Post = {
      id: Math.random().toString(),
      user: 'Usuário', // Nome do usuário (mockado aqui)
      profilePic: 'https://example.com/profile.jpg', // Mock de imagem de perfil
      content: text,
      mediaUrl,
      type,
      timestamp: Date.now(),
    };

    socket.emit('newPost', newPost);
    setText('');
    setMediaUrl(undefined);
    setType('text');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setMediaUrl(result.assets[0].uri);
      setType('image');
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra de postagem */}
      <View style={styles.postBar}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="O que você está pensando?"
          style={styles.input}
        />
        <View style={styles.mediaButtons}>
          <TouchableOpacity onPress={pickImage}>
            <FontAwesome name="image" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="keyboard-voice" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="video-call" size={24} color="red" />
          </TouchableOpacity>
        </View>
        <Button title="Postar" onPress={handleSend} />
      </View>

      {/* Linha do tempo */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
              <Text style={styles.username}>{item.user}</Text>
            </View>
            <Text>{item.content}</Text>
            {item.mediaUrl && item.type === 'image' && (
              <Image source={{ uri: item.mediaUrl }} style={styles.image} />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;