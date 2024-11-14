// screens/LoginScreen.tsx
import React from 'react';
import { View, TextInput, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import styles from '../LoginScreen/LoginScreen.styles'; // Importando o arquivo de estilos

// Definindo os tipos de navegação e rota para a tela
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

// Definindo o componente sem alterar o número de linhas
const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate('Home'); // Mantendo a navegação
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />
        <Button title="Login" onPress={handleLogin} color="#1E90FF" />
      </View>
    </View>
  );
};

export default LoginScreen;