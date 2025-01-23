// src/App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import ChatScreen from './screens/ChatScreen/ChatScreen';
import ExploreNearbyScreen from './screens/ExploreNearbyScreen/ExploreNearbyScreen';
import SignupScreen from './screens/SignupScreen/SignupScreen';

export type RootStackParamList = {
  Cadastro: undefined;
  Login: undefined;
  Home: undefined;
  Chat: { userId: string };
  ExploreNearby: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Configuração de Deep Linking
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['http://localhost:8081'], // Adicione aqui o prefixo para o ambiente de desenvolvimento
  config: {
    screens: {
      Cadastro: 'register',
      Login: 'login',
      Home: 'home',
      Chat: 'chat/:userId',
      ExploreNearby: 'explore',
    },
  },
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Cadastro" 
            component={SignupScreen} 
            options={{ 
              headerTitle: 'helloworld - Cadastro', 
              headerStyle: { backgroundColor: '#1E90FF' }, 
              headerTintColor: '#fff' 
            }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              headerTitle: 'helloworld - Home', 
              headerStyle: { backgroundColor: '#1E90FF' }, 
              headerTintColor: '#fff' 
            }}
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={{ 
              headerTitle: 'Chat', 
              headerStyle: { backgroundColor: '#1E90FF' }, 
              headerTintColor: '#fff' 
            }}
          />
          <Stack.Screen 
            name="ExploreNearby" 
            component={ExploreNearbyScreen} 
            options={{ 
              headerTitle: 'Explore Nearby', 
              headerStyle: { backgroundColor: '#1E90FF' }, 
              headerTintColor: '#fff' 
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;