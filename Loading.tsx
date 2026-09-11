import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface LoadingProps {
  message?: string;
}

// `message` has a default value, demonstrating a default prop.
function Loading({ message = 'Loading...' }: LoadingProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={[styles.text, { color: colors.subtext }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  text: {
    marginLeft: 8,
    fontSize: 13,
  },
});

export default Loading;
