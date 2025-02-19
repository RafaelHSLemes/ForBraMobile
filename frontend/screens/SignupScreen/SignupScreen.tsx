import React, { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, Button, Alert, TouchableOpacity,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import styles from './SignupScreen.styles';
import { geocodeAddress } from '../../services/Register';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [form, setForm] = useState({
    name: '', email: '', password: '', street: '', houseNumber: '',
    neighborhood: '', city: '', state: '', country: '', zipCode: '',
    profession: '', interests: [] as string[], interestInput: ''
  });

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleInterestInput = (text: string) => {
    if (text.includes(' ')) {
      const newTag = text.trim();
      if (newTag && !form.interests.includes(newTag)) {
        setForm({ ...form, interests: [...form.interests, newTag], interestInput: '' });
      }
    } else {
      setForm({ ...form, interestInput: text });
    }
  };

  const handleSignup = async () => {
    try {
      // Obter coordenadas a partir do endereço
      const coordinates = await geocodeAddress(
        form.street, form.houseNumber, form.neighborhood,
        form.city, form.state, form.country, form.zipCode
      );

      if (!coordinates) {
        Alert.alert('Erro', 'Endereço inválido.');
        return;
      }

      // Dados para envio ao backend
      const userData = {
        nome: form.name,
        email: form.email,
        senha: form.password,
        endereco: {
          logradouro: form.street,
          numero: form.houseNumber,
          bairro: form.neighborhood,
          cidade: form.city,
          estado: form.state,
          pais: form.country,
          CEP: form.zipCode,
        },
        localizacao: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
        profissao: form.profession,
        interesses: form.interests,
      };

      // Envio ao backend
      const response = await axios.post('http://localhost:3000/api/users/register', userData);

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        navigation.navigate('Login'); // Redirecionar para a tela de login
      } else {
        Alert.alert('Erro', 'Erro ao registrar usuário.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao registrar usuário.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.title}>Cadastro</Text>
          <View style={styles.rowContainer}>
            <TextInput placeholder="Nome" value={form.name} onChangeText={(text) => handleInputChange('name', text)} style={styles.input} />
            <TextInput placeholder="Email" value={form.email} onChangeText={(text) => handleInputChange('email', text)} style={styles.input} keyboardType="email-address" />
          </View>
          <TextInput placeholder="Senha" value={form.password} onChangeText={(text) => handleInputChange('password', text)} style={styles.input} secureTextEntry />
          <View style={styles.rowContainer}>
            <TextInput placeholder="Rua" value={form.street} onChangeText={(text) => handleInputChange('street', text)} style={styles.input} />
            <TextInput placeholder="Número" value={form.houseNumber} onChangeText={(text) => handleInputChange('houseNumber', text)} style={styles.input} keyboardType="numeric" />
          </View>
          <View style={styles.rowContainer}>
            <TextInput placeholder="Bairro" value={form.neighborhood} onChangeText={(text) => handleInputChange('neighborhood', text)} style={styles.input} />
            <TextInput placeholder="Cidade" value={form.city} onChangeText={(text) => handleInputChange('city', text)} style={styles.input} />
          </View>
          <View style={styles.rowContainer}>
            <TextInput placeholder="Estado" value={form.state} onChangeText={(text) => handleInputChange('state', text)} style={styles.input} />
            <TextInput placeholder="País" value={form.country} onChangeText={(text) => handleInputChange('country', text)} style={styles.input} />
          </View>
          <TextInput placeholder="CEP" value={form.zipCode} onChangeText={(text) => handleInputChange('zipCode', text)} style={styles.input} keyboardType="numeric" />
          <TextInput placeholder="Profissão" value={form.profession} onChangeText={(text) => handleInputChange('profession', text)} style={styles.input} />
          <TextInput placeholder="Adicione interesses e pressione espaço" value={form.interestInput} onChangeText={handleInterestInput} style={styles.input} />
          <View style={styles.tagsContainer}>
            {form.interests.map((interest, index) => (
              <Text key={index} style={styles.tag}>{interest}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Cadastrar" onPress={handleSignup} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já possui uma conta? Clique aqui para entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;