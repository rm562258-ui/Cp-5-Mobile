import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './firebaseConfig';

export const firebaseConfigurado = !String(firebaseConfig.apiKey).startsWith('COLE_AQUI');

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Autenticação com persistência da sessão via AsyncStorage
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Já inicializado (ex.: Fast Refresh)
  auth = getAuth(app);
}

let db;
try {
  db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
} catch (e) {
  db = getFirestore(app);
}

export { app, auth, db };
