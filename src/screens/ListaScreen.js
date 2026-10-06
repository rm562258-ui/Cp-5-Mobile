import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';
import { useGastos } from '../context/GastosContext';
import { excluirRegistro } from '../services/firestore';
import { traduzirErro } from '../utils/authErrors';
import { formatarMoeda } from '../utils/format';
import { colors } from '../theme';

export default function ListaScreen({ navigation }) {
  const { user } = useAuth();
  const { gastos, loading, erro } = useGastos();
  const [feedback, setFeedback] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const mostrarFeedback = (type, text) => {
    setFeedback({ type, text });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(null), 3500);
  };

  const confirmarExclusao = (gasto) => {
    Alert.alert('Excluir registro', 'Tem certeza que deseja excluir este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirRegistro(user.uid, gasto.id);
            mostrarFeedback('success', 'Registro excluído com sucesso.');
          } catch (e) {
            mostrarFeedback('error', traduzirErro(e));
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.desc}>{item.descricao}</Text>
          <Text style={styles.meta}>
            {item.categoria} • {item.data}
          </Text>
        </View>
        <Text style={styles.valor}>{formatarMoeda(item.valor)}</Text>
      </View>
      {!!item.observacao && <Text style={styles.obs}>{item.observacao}</Text>}
      <View style={styles.actions}>
        <Button
          title="Editar"
          variant="outline"
          style={styles.actionBtn}
          onPress={() => navigation.navigate('EdicaoRegistro', { gasto: item })}
        />
        <Button title="Excluir" variant="danger" style={styles.actionBtn} onPress={() => confirmarExclusao(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={gastos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Button title="+ Novo gasto" onPress={() => navigation.navigate('CadastroRegistro')} />
            <View style={{ height: 12 }} />
            {feedback && <Message type={feedback.type} text={feedback.text} />}
            <Message type="error" text={erro} />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <Text style={styles.empty}>Nenhum registro encontrado.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 20, flexGrow: 1 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  desc: { fontSize: 17, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.muted, marginTop: 3 },
  valor: { fontSize: 17, fontWeight: '800', color: colors.danger, marginLeft: 8 },
  obs: { fontSize: 14, color: colors.text, marginTop: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  actionBtn: { flex: 1, minHeight: 42, paddingVertical: 9, marginTop: 0 },
  empty: { textAlign: 'center', color: colors.muted, fontSize: 16, marginTop: 40 },
});
