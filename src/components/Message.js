import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

// type: 'error' | 'success'
export default function Message({ type = 'error', text }) {
  if (!text) return null;
  const sucesso = type === 'success';
  return (
    <View style={[styles.box, sucesso ? styles.success : styles.error]}>
      <Text style={[styles.text, { color: sucesso ? colors.success : colors.danger }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: 10, padding: 12, marginBottom: 14 },
  error: { backgroundColor: colors.dangerLight },
  success: { backgroundColor: colors.successLight },
  text: { fontSize: 14, fontWeight: '600' },
});
