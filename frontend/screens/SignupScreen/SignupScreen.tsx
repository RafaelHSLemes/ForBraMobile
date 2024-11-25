// SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { registerUser } from '../../services/registerUser';
import styles from './SignupScreen.styles';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState<string>(''); // Mantém "name"
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>(''); // Mantém "password"
  const [profession, setProfession] = useState<string>(''); // Mantém "profession"
  const [localization, setLocalization] = useState<string>(''); // Mantém "localization"
  const [interests, setInterests] = useState<string>(''); // Mantém "interests"

  // Função para obter a latitude e longitude a partir do endereço
  const getCoordinates = async (address: string) => {
    try {
      const response = await axios.get(
        `https://api.ipapi.com/api/${address}?access_key=e76a0dff9465eb17f88cc34791c4d2ea&format=1`
      );
      const location = response.data.location;
      if (location) {
        return { latitude: location.latitude, longitude: location.longitude };
      } else {
        throw new Error('Localização não encontrada');
      }
    } catch (error) {
      throw new Error('Erro ao obter a localização');
    }
  };

  const handleSignup = async () => {
    try {
      // Obtém as coordenadas baseando-se no endereço fornecido
      const coordinates = await getCoordinates(localization);

      const response = await registerUser({
        name, // Mantém "name"
        email,
        password, // Mantém "password"
        localization: coordinates, // Passando as coordenadas
        profession, // Mantém "profession"
        interests: interests.split(',').map((i) => i.trim()), // Transforma interesses em array
      });

      if (response.error) {
        Alert.alert('Erro', response.error);
      } else {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        navigation.navigate('Login');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro', error.message); // Agora tratado corretamente
      } else {
        Alert.alert('Erro', 'Erro inesperado ao registrar usuário');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Profissão"
        value={profession}
        onChangeText={setProfession}
        style={styles.input}
      />
      <TextInput
        placeholder="Endereço"
        value={localization}
        onChangeText={setLocalization}
        style={styles.input}
      />
      <TextInput
        placeholder="Interesses (separados por vírgula)"
        value={interests}
        onChangeText={setInterests}
        style={styles.input}
      />
      <Button title="Cadastrar" onPress={handleSignup} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já possui uma conta? Clique aqui para entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;