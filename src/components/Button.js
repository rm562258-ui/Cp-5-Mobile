import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

// variant: 'primary' | 'outline' | 'danger' | 'link'
export default function Button({ title, onPress, loading = false, disabled = false, variant = 'primary', style }) {
  const bloqueado = loading || disabled;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={bloqueado}
      style={[styles.base, styles[variant], bloqueado && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : colors.primary} />
      ) : (
        <Text style={[styles.text, textStyles[variant]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 10, paddingVertical: 13, alignItems: 'center', justifyContent: 'center', marginTop: 6, minHeight: 48 },
  primary: { backgroundColor: colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  link: { backgroundColor: 'transparent', paddingVertical: 8, minHeight: 36 },
  disabled: { opacity: 0.6 },
  text: { fontSize: 16, fontWeight: '700' },
});

const textStyles = StyleSheet.create({
  primary: { color: '#fff' },
  danger: { color: '#fff' },
  outline: { color: colors.primary },
  link: { color: colors.primary, fontWeight: '600', fontSize: 15 },
});
