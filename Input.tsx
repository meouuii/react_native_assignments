import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface InputProps {
  label: string; // normal prop
  value: string; // normal prop
  onChangeText: (text: string) => void; // normal prop
  placeholder?: string;
  multiline?: boolean; // has a default value below
  error?: string;
}

// `multiline` defaults to false, demonstrating a default prop value.
function Input({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  error,
}: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.group}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          {
            borderColor: error ? colors.danger : colors.border,
            color: colors.text,
            backgroundColor: colors.background,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.subtext}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      {error ? (
        <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  error: { fontSize: 12, marginTop: 4 },
});

export default Input;
