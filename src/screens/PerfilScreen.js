import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Input from '../components/Input';
import Button from '../components/Button';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';
import { traduzirErro } from '../utils/authErrors';
import { colors } from '../theme';

export default function PerfilScreen() {
  const { user, logout, deleteAccount, precisaReautenticar } = useAuth();
  const [erro, setErro] = useState('');
  const [saindo, setSaindo] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroModal, setErroModal] = useState('');

  const sair = async () => {
    setErro('');
    setSaindo(true);
    try {
      await logout(); // volta automaticamente para a tela de login
    } catch (e) {
      setErro(traduzirErro(e));
      setSaindo(false);
    }
  };

  const executarExclusao = async (senhaConfirmacao) => {
    setErro('');
    setErroModal('');
    setExcluindo(true);
    try {
      await deleteAccount(senhaConfirmacao);
      // Conta excluída: o navegador retorna para a tela de login
    } catch (e) {
      const senhaErrada = e?.code === 'auth/invalid-credential' || e?.code === 'auth/wrong-password';
      if (modalVisivel) {
        setErroModal(senhaErrada ? 'Senha incorreta.' : traduzirErro(e));
      } else {
        setErro(traduzirErro(e));
      }
      setExcluindo(false);
    }
  };

  const iniciarExclusao = () => {
    if (precisaReautenticar()) {
      setSenha('');
      setErroModal('');
      setModalVisivel(true);
    } else {
      executarExclusao();
    }
  };

  const confirmarExclusao = () => {
    Alert.alert('Excluir conta', 'Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: iniciarExclusao },
    ]);
  };

  return (
    <Screen>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(user?.nome || user?.email || '?').charAt(0).toUpperCase()}</Text>
      </View>

      <Message type="error" text={erro} />

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.nome || '—'}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <Button title="Sair (Logout)" variant="outline" onPress={sair} loading={saindo} disabled={excluindo} />
      <Button title="Excluir conta" variant="danger" onPress={confirmarExclusao} loading={excluindo && !modalVisivel} disabled={saindo} />

      <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={() => setModalVisivel(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Confirme sua senha</Text>
            <Text style={styles.modalText}>Por segurança, informe sua senha para excluir a conta.</Text>
            <Message type="error" text={erroModal} />
            <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="Sua senha" />
            <Button
              title="Excluir conta"
              variant="danger"
              loading={excluindo}
              onPress={() => (senha ? executarExclusao(senha) : setErroModal('Informe sua senha.'))}
            />
            <Button title="Cancelar" variant="link" disabled={excluindo} onPress={() => setModalVisivel(false)} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 16,
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '800' },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16 },
  label: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  value: { fontSize: 17, color: colors.text, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: colors.card, borderRadius: 14, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  modalText: { fontSize: 14, color: colors.muted, marginVertical: 8 },
});
