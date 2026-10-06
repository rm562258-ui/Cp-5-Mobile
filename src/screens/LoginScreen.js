import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Input from '../components/Input';
import Button from '../components/Button';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';
import { traduzirErro } from '../utils/authErrors';
import { emailValido } from '../utils/format';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const entrar = async () => {
    setErro('');
    if (!email.trim() || !senha) return setErro('Preencha o e-mail e a senha.');
    if (!emailValido(email)) return setErro('Formato de e-mail inválido.');

    setLoading(true);
    try {
      await signIn(email, senha);
      // Ao autenticar, o navegador direciona automaticamente para a área autenticada
    } catch (e) {
      setErro(traduzirErro(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen safe contentStyle={styles.content}>
      <Text style={styles.logo}>💰</Text>
      <Text style={styles.title}>Controle de Gastos</Text>
      <Text style={styles.subtitle}>Entre na sua conta</Text>

      <Message type="error" text={erro} />

      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="seuemail@exemplo.com"
        keyboardType="email-address"
        autoCorrect={false}
      />
      <Input
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        placeholder="Sua senha"
        secureTextEntry
      />

      <Button title="Entrar" onPress={entrar} loading={loading} />

      <View style={styles.links}>
        <Button title="Esqueci minha senha" variant="link" onPress={() => navigation.navigate('EsqueciSenha')} />
        <Button title="Não tem conta? Cadastre-se" variant="link" onPress={() => navigation.navigate('Cadastro')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center' },
  logo: { fontSize: 48, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.muted, textAlign: 'center', marginBottom: 24, marginTop: 4 },
  links: { marginTop: 12, alignItems: 'center' },
});
