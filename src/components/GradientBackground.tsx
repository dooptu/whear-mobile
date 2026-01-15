import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../hooks/useAppTheme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  colors: customColors,
}) => {
  const { colors, isDark } = useAppTheme();
  const gradientColors = customColors || colors.backgroundGradient;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.background : colors.background }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


