import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Button from '../components/Button';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';
import { useGastos } from '../context/GastosContext';
import { formatarMoeda } from '../utils/format';
import { colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { gastos, loading, erro } = useGastos();

  const total = useMemo(() => gastos.reduce((soma, g) => soma + (Number(g.valor) || 0), 0), [gastos]);
  const recentes = gastos.slice(0, 3);
  const primeiroNome = (user?.nome || '').split(' ')[0];

  return (
    <Screen>
      <Text style={styles.hello}>Olá{primeiroNome ? `, ${primeiroNome}` : ''}! 👋</Text>
      <Text style={styles.sub}>Veja o resumo dos seus gastos.</Text>

      <Message type="error" text={erro} />

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Total gasto</Text>
        {loading ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />
        ) : (
          <Text style={styles.summaryValue}>{formatarMoeda(total)}</Text>
        )}
        <Text style={styles.summaryInfo}>
          {gastos.length} {gastos.length === 1 ? 'registro' : 'registros'}
        </Text>
      </View>

      <Button title="+ Novo gasto" onPress={() => navigation.navigate('CadastroRegistro')} />
      <Button title="Ver todos os gastos" variant="outline" onPress={() => navigation.navigate('Registros')} />

      <Text style={styles.section}>Últimos gastos</Text>
      {!loading && recentes.length === 0 && <Text style={styles.empty}>Nenhum registro encontrado.</Text>}
      {recentes.map((g) => (
        <View key={g.id} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{g.descricao}</Text>
            <Text style={styles.rowSub}>
              {g.categoria} • {g.data}
            </Text>
          </View>
          <Text style={styles.rowValue}>{formatarMoeda(g.valor)}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hello: { fontSize: 24, fontWeight: '800', color: colors.text },
  sub: { fontSize: 15, color: colors.muted, marginBottom: 16, marginTop: 2 },
  summary: { backgroundColor: colors.primary, borderRadius: 14, padding: 20, marginBottom: 12 },
  summaryLabel: { color: '#C8E6C9', fontSize: 14, fontWeight: '600' },
  summaryValue: { color: '#fff', fontSize: 32, fontWeight: '800', marginTop: 4 },
  summaryInfo: { color: '#C8E6C9', fontSize: 13, marginTop: 4 },
  section: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 24, marginBottom: 10 },
  empty: { color: colors.muted, fontSize: 15 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  rowTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  rowSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  rowValue: { fontSize: 16, fontWeight: '700', color: colors.danger, marginLeft: 8 },
});
