import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

export const LoadingSpinner: React.FC = () => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
