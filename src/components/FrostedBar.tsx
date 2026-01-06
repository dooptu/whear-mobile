import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../hooks/useAppTheme';

interface FrostedBarProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const FrostedBar: React.FC<FrostedBarProps> = ({ children, style }) => {
  const { colors, borderRadius, blur: blurAmount } = useAppTheme();

  const barStyle: ViewStyle = {
    borderRadius: borderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.glassSurface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  };

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={blurAmount.strong} style={[barStyle, style]}>
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[barStyle, style]}>
      {children}
    </View>
  );
};


