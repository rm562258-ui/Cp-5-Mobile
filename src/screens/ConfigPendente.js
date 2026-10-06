import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function ConfigPendente() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Firebase não configurado</Text>
        <Text style={styles.text}>
          Abra o arquivo src/config/firebaseConfig.js e cole as credenciais do seu projeto Firebase.
          Veja o passo a passo no README.md.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  box: { backgroundColor: colors.card, borderRadius: 12, padding: 20 },
  title: { fontSize: 20, fontWeight: '700', color: colors.danger, marginBottom: 10 },
  text: { fontSize: 15, color: colors.text, lineHeight: 22 },
});
