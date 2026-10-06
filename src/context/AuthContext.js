import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { salvarPerfil, excluirDadosUsuario } from '../services/firestore';

// Guarda apenas dados da sessão. NUNCA a senha.
const SESSION_KEY = '@controle_gastos:sessao';

const AuthContext = createContext(null);

const montarUsuario = (u) =>
  u ? { uid: u.uid, email: u.email, nome: u.displayName || '' } : null;

async function salvarSessao(usuario) {
  try {
    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...usuario, salvoEm: Date.now() })
    );
  } catch (e) {
    // falha de armazenamento local não deve derrubar o app
  }
}

async function limparSessao() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (e) {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Verificação da sessão ao abrir o app:
  // 1) lê a sessão salva no AsyncStorage; 2) o Firebase restaura o usuário
  // (também persistido via AsyncStorage). Se não houver usuário, a sessão local é removida.
  useEffect(() => {
    let ativo = true;
    let unsubscribe = () => {};

    (async () => {
      try {
        await AsyncStorage.getItem(SESSION_KEY);
      } catch (e) {}

      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (!ativo) return;
        if (fbUser) {
          const info = montarUsuario(fbUser);
          setUser(info);
          await salvarSessao(info);
        } else {
          setUser(null);
          await limparSessao();
        }
        if (ativo) setInitializing(false);
      });
    })();

    return () => {
      ativo = false;
      unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (nome, email, senha) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), senha);
    await updateProfile(cred.user, { displayName: nome.trim() });
    const info = montarUsuario(auth.currentUser);
    setUser(info);
    await salvarSessao(info);
    try {
      await salvarPerfil(cred.user.uid, { nome: nome.trim(), email: email.trim() });
    } catch (e) {
      // perfil no Firestore é complementar; não bloqueia o cadastro
    }
  }, []);

  const signIn = useCallback(async (email, senha) => {
    await signInWithEmailAndPassword(auth, email.trim(), senha);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    await limparSessao();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email) => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  // Se o login for antigo, o Firebase exige reautenticação antes de excluir
  const precisaReautenticar = useCallback(() => {
    const u = auth.currentUser;
    const ultimo = u?.metadata?.lastSignInTime ? new Date(u.metadata.lastSignInTime).getTime() : 0;
    return Date.now() - ultimo > 4 * 60 * 1000;
  }, []);

  const deleteAccount = useCallback(async (senha) => {
    const u = auth.currentUser;
    if (!u) throw new Error('Usuário não autenticado.');
    if (senha) {
      const credencial = EmailAuthProvider.credential(u.email, senha);
      await reauthenticateWithCredential(u, credencial);
    }
    await excluirDadosUsuario(u.uid);
    await deleteUser(u);
    await limparSessao();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, initializing, signUp, signIn, logout, resetPassword, deleteAccount, precisaReautenticar }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
