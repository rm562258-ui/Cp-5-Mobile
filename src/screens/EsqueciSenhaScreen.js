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

export default function EsqueciSenhaScreen({ navigation }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    setErro('');
    setSucesso('');
    if (!email.trim()) return setErro('Informe o seu e-mail.');
    if (!emailValido(email)) return setErro('Formato de e-mail inválido.');

    setLoading(true);
    try {
      await resetPassword(email);
      setSucesso('Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.');
    } catch (e) {
      if (e?.code === 'auth/user-not-found') {
        // Mesma resposta para não revelar quais e-mails existem
        setSucesso('Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.');
      } else {
        setErro(traduzirErro(e));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen safe>
      <Text style={styles.title}>Esqueci minha senha</Text>
      <Text style={styles.subtitle}>Informe seu e-mail para receber as instruções de recuperação.</Text>

      <Message type="error" text={erro} />
      <Message type="success" text={sucesso} />

      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="seuemail@exemplo.com"
        keyboardType="email-address"
        autoCorrect={false}
      />

      <Button title="Enviar instruções" onPress={enviar} loading={loading} />
      <Button title="Voltar para o login" variant="link" onPress={() => navigation.goBack()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800', color: colors.primary, marginTop: 8 },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 20, marginTop: 4 },
});
