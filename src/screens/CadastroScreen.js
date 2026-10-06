import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Screen from '../components/Screen';
import Input from '../components/Input';
import Button from '../components/Button';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';
import { traduzirErro } from '../utils/authErrors';
import { emailValido } from '../utils/format';
import { colors } from '../theme';

export default function CadastroScreen({ navigation }) {
  const { signUp } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const cadastrar = async () => {
    setErro('');
    if (!nome.trim() || !email.trim() || !senha || !confirmar) {
      return setErro('Preencha todos os campos.');
    }
    if (!emailValido(email)) return setErro('Formato de e-mail inválido.');
    if (senha.length < 6) return setErro('A senha deve ter pelo menos 6 caracteres.');
    if (senha !== confirmar) return setErro('As senhas não coincidem.');

    setLoading(true);
    try {
      await signUp(nome, email, senha);
    } catch (e) {
      setErro(traduzirErro(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen safe>
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

      <Message type="error" text={erro} />

      <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" autoCapitalize="words" />
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="seuemail@exemplo.com"
        keyboardType="email-address"
        autoCorrect={false}
      />
      <Input label="Senha" value={senha} onChangeText={setSenha} placeholder="Mínimo 6 caracteres" secureTextEntry />
      <Input
        label="Confirmação de senha"
        value={confirmar}
        onChangeText={setConfirmar}
        placeholder="Repita a senha"
        secureTextEntry
      />

      <Button title="Cadastrar" onPress={cadastrar} loading={loading} />
      <Button title="Já tem conta? Faça login" variant="link" onPress={() => navigation.goBack()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800', color: colors.primary, marginTop: 8 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 20, marginTop: 4 },
});
