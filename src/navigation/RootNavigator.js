import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { GastosProvider } from '../context/GastosContext';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import EsqueciSenhaScreen from '../screens/EsqueciSenhaScreen';
import HomeScreen from '../screens/HomeScreen';
import ListaScreen from '../screens/ListaScreen';
import FormGastoScreen from '../screens/FormGastoScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { colors } from '../theme';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
};

const icone = (emoji) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ ...headerOptions, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início', tabBarIcon: icone('🏠') }} />
      <Tab.Screen
        name="Registros"
        component={ListaScreen}
        options={{ title: 'Meus gastos', tabBarIcon: icone('🧾') }}
      />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Minha conta', tabBarIcon: icone('👤') }} />
    </Tab.Navigator>
  );
}

// Área autenticada
function AppRoutes() {
  return (
    <GastosProvider>
      <AppStack.Navigator screenOptions={headerOptions}>
        <AppStack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <AppStack.Screen name="CadastroRegistro" component={FormGastoScreen} options={{ title: 'Novo gasto' }} />
        <AppStack.Screen name="EdicaoRegistro" component={FormGastoScreen} options={{ title: 'Editar gasto' }} />
      </AppStack.Navigator>
    </GastosProvider>
  );
}

// Área não autenticada
function AuthRoutes() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Cadastro" component={CadastroScreen} />
      <AuthStack.Screen name="EsqueciSenha" component={EsqueciSenhaScreen} />
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Usuário não autenticado nunca tem acesso às telas da área autenticada
  return <NavigationContainer>{user ? <AppRoutes /> : <AuthRoutes />}</NavigationContainer>;
}
