// SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import styles from './SignupScreen.styles';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [interests, setInterests] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    Alert.alert('Cadastro realizado com sucesso!');
    navigation.navigate('Login');
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
        placeholder="Profissão"
        value={profession}
        onChangeText={setProfession}
        style={styles.input}
      />
      <TextInput
        placeholder="Interesses (separados por vírgula)"
        value={interests}
        onChangeText={setInterests}
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
      <Button title="Cadastrar" onPress={handleSignup} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já possui uma conta? Clique aqui para entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;