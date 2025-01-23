import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import styles from './SignupScreen.styles';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [profession, setProfession] = useState<string>('');
  const [localization, setLocalization] = useState<string>('');
  const [interests, setInterests] = useState<string>('');

  const handleSignup = async () => {
    try {
      // Validar entrada do endereço
      if (!localization.trim()) {
        Alert.alert('Erro', 'Por favor, insira um endereço válido.');
        return;
      }

      // Obter coordenadas
      const coordinates = await getCoordinates(localization.trim());

      // Verificar se as coordenadas foram captadas corretamente
      if (!coordinates) {
        Alert.alert('Erro', 'Não foi possível obter a localização. Verifique o endereço.');
        return;
      }

      // Enviar dados ao backend
      const response = await axios.post('http://localhost:3000/api/users/register', {
        nome: name.trim(),
        email: email.trim(),
        senha: password,
        profissao: profession.trim(),
        localizacao: {
          type: 'Point',
          coordinates: [coordinates.longitude, coordinates.latitude],
        },
        interesses: interests
          .split(',')
          .map((interest) => interest.trim())
          .filter((interest) => interest), // Remove entradas vazias
      });

      Alert.alert('Sucesso', response.data.message || 'Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Erro', error.response.data.message || 'Erro no servidor');
      } else if (error instanceof Error) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Erro inesperado ao registrar usuário');
      }
    }
  };

  const getCoordinates = async (address: string) => {
    try {
      const response = await axios.get('https://api.positionstack.com/v1/forward', {
        params: {
          access_key: '4d9ddcc9b7ea6b601550fa91f642fa9d',
          query: address,
          limit: 1, // Limita a resposta para evitar ambiguidades
        },
      });
      const { data } = response;

      if (data?.data?.length > 0) {
        const location = data.data[0];
        // Verificar se latitude e longitude existem
        if (location.latitude && location.longitude) {
          return { latitude: location.latitude, longitude: location.longitude };
        }
      }
      throw new Error('Endereço não encontrado');
    } catch (error) {
      throw new Error('Erro ao obter localização: ' + (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TextInput placeholder="Profissão" value={profession} onChangeText={setProfession} style={styles.input} />
      <TextInput placeholder="Endereço" value={localization} onChangeText={setLocalization} style={styles.input} />
      <TextInput placeholder="Interesses (separados por vírgula)" value={interests} onChangeText={setInterests} style={styles.input} />
      <Button title="Cadastrar" onPress={handleSignup} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já possui uma conta? Clique aqui para entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;