import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { firebaseConfigurado } from './src/config/firebase';
import ConfigPendente from './src/screens/ConfigPendente';

export default function App() {
  if (!firebaseConfigurado) {
    return (
      <SafeAreaProvider>
        <ConfigPendente />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
