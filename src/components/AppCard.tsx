import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../hooks/useAppTheme';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  glass?: boolean;
  variant?: 'default' | 'elevated' | 'floating' | 'glass';
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  padding = 16,
  glass = true,
  variant = 'default',
}) => {
  const { colors, borderRadius, shadows, blur: blurAmount } = useAppTheme();

  const getCardStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: borderRadius.lg,
      padding,
      overflow: 'hidden',
    };

    if (glass) {
      return {
        ...base,
        backgroundColor: colors.glassSurface,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        ...shadows.glass,
      };
    }

    if (variant === 'elevated') {
      return {
        ...base,
        backgroundColor: colors.glassSurface,
        ...shadows.glassStrong,
      };
    }

    if (variant === 'floating') {
      return {
        ...base,
        backgroundColor: colors.glassSurface,
        ...shadows.glassStrong,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      };
    }

    if (variant === 'glass') {
      return {
        ...base,
        backgroundColor: colors.glassSurface,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        ...shadows.glass,
      };
    }

    return {
      ...base,
      backgroundColor: colors.glassSurface,
      ...shadows.soft,
    };
  };

  if (glass && Platform.OS === 'ios') {
    return (
      <BlurView intensity={blurAmount.medium} style={[getCardStyle(), style]}>
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};
