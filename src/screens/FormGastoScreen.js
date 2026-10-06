import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Screen from '../components/Screen';
import Input from '../components/Input';
import Button from '../components/Button';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';
import { criarRegistro, atualizarRegistro } from '../services/firestore';
import { traduzirErro } from '../utils/authErrors';
import { converterValor, dataHoje, dataValida, formatarMoeda, mascararData } from '../utils/format';
import { colors } from '../theme';

const CATEGORIAS = ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros'];

// Usada nas rotas "CadastroRegistro" (novo) e "EdicaoRegistro" (editar)
export default function FormGastoScreen({ navigation, route }) {
  const { user } = useAuth();
  const gasto = route.params?.gasto;
  const editando = !!gasto;

  const [descricao, setDescricao] = useState(gasto?.descricao ?? '');
  const [valor, setValor] = useState(
    gasto ? formatarMoeda(gasto.valor).replace('R$ ', '') : ''
  );
  const [categoria, setCategoria] = useState(gasto?.categoria ?? '');
  const [data, setData] = useState(gasto?.data ?? dataHoje());
  const [observacao, setObservacao] = useState(gasto?.observacao ?? '');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    setErro('');
    if (!descricao.trim() || !valor.trim() || !categoria.trim() || !data.trim()) {
      return setErro('Preencha descrição, valor, categoria e data.');
    }
    const valorNumero = converterValor(valor);
    if (Number.isNaN(valorNumero) || valorNumero <= 0) {
      return setErro('Informe um valor válido, maior que zero.');
    }
    if (!dataValida(data)) return setErro('Informe uma data válida no formato DD/MM/AAAA.');

    const dados = {
      descricao: descricao.trim(),
      valor: valorNumero,
      categoria: categoria.trim(),
      data,
      observacao: observacao.trim(),
    };

    setLoading(true);
    try {
      if (editando) {
        await atualizarRegistro(user.uid, gasto.id, dados);
      } else {
        await criarRegistro(user.uid, dados);
      }
      Alert.alert('Sucesso', editando ? 'Registro atualizado com sucesso!' : 'Registro cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setErro(traduzirErro(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Message type="error" text={erro} />

      <Input
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex.: Almoço"
        autoCapitalize="sentences"
      />
      <Input
        label="Valor (R$)"
        value={valor}
        onChangeText={setValor}
        placeholder="Ex.: 35,90"
        keyboardType="decimal-pad"
      />
      <Input
        label="Categoria"
        value={categoria}
        onChangeText={setCategoria}
        placeholder="Ex.: Alimentação"
        autoCapitalize="sentences"
      />
      <View style={styles.chips}>
        {CATEGORIAS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setCategoria(c)}
            style={[styles.chip, categoria === c && styles.chipActive]}
          >
            <Text style={[styles.chipText, categoria === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Input
        label="Data"
        value={data}
        onChangeText={(t) => setData(mascararData(t))}
        placeholder="DD/MM/AAAA"
        keyboardType="number-pad"
        maxLength={10}
      />
      <Input
        label="Observação (opcional)"
        value={observacao}
        onChangeText={setObservacao}
        placeholder="Alguma anotação sobre o gasto"
        autoCapitalize="sentences"
        multiline
      />

      <Button title={editando ? 'Salvar alterações' : 'Cadastrar gasto'} onPress={salvar} loading={loading} />
      <Button title="Cancelar" variant="link" onPress={() => navigation.goBack()} disabled={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14, marginTop: -4 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.muted },
  chipTextActive: { color: colors.primary, fontWeight: '700' },
});
