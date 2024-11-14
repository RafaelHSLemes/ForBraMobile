// src/App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import ChatScreen from './screens/ChatScreen/ChatScreen';
import ExploreNearbyScreen from './screens/ExploreNearbyScreen/ExploreNearbyScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Chat: { userId: string };
  ExploreNearby: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              headerTitle: 'Home', 
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