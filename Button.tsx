import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  title?: string; // normal prop
  onPress: () => void; // normal prop
  variant?: Variant; // has a default value below
  disabled?: boolean; // has a default value below
  loading?: boolean;
  children?: ReactNode; // children prop — lets a caller render custom content
}

// `variant`, `disabled`, and `loading` all fall back to defaults if the
// parent doesn't pass them, demonstrating default prop values.
function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  children,
}: ButtonProps) {
  const { colors } = useTheme();

  const backgroundColor =
    variant === 'danger'
      ? colors.danger
      : variant === 'secondary'
      ? colors.card
      : colors.primary;

  const textColor = variant === 'secondary' ? colors.text : '#ffffff';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor: colors.border },
        variant === 'secondary' && styles.secondaryBorder,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : children ? (
        // If the caller passed children, render that instead of `title`.
        children
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  secondaryBorder: {
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Button;
