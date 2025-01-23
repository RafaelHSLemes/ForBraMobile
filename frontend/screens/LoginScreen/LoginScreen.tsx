// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import styles from '../LoginScreen/LoginScreen.styles'; // Importando o arquivo de estilos

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Cadastro: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const LoginScreen: React.FC<Props> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    try {
      console.log('[LOGIN] Tentativa de login para o e-mail:', email);
      
      const response = await axios.post('http://localhost:3000/api/users/login', { email, password });
      console.log('[LOGIN] Resposta do backend:', response);

      if (response.data.token) {
        Alert.alert('Login bem-sucedido!', 'Bem-vindo de volta!');
        navigation.navigate('Home'); // Navega para a tela Home
      } else {
        Alert.alert('Erro', 'Não foi possível autenticar. Tente novamente.');
      }
    } catch (error: any) {
      console.error('[LOGIN] Erro ao tentar fazer login:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login.';
      Alert.alert('Erro', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={handleLogin} color="#1E90FF" />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.link}>
        <Text style={styles.link}>Ainda não tem uma conta? Clique aqui para se cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;