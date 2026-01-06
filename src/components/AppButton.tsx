import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const { colors, typography, borderRadius, shadows } = useAppTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      height: 48,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    if (variant === 'primary') {
      return {
        ...base,
        backgroundColor: colors.accent,
      };
    } else if (variant === 'secondary') {
      return {
        ...base,
        backgroundColor: colors.glassSurface,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      };
    } else if (variant === 'glass') {
      return {
        ...base,
        backgroundColor: colors.glassSurface,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        ...shadows.glass,
      };
    } else {
      // ghost
      return {
        ...base,
        backgroundColor: 'transparent',
      };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      ...typography.body,
      fontWeight: '600',
    };

    if (variant === 'primary') {
      return { ...base, color: '#FFFFFF' };
    } else if (variant === 'secondary' || variant === 'glass') {
      return { ...base, color: colors.textPrimary };
    } else {
      return { ...base, color: colors.accent };
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[getButtonStyle(), (disabled || loading) && { opacity: 0.5 }, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        <Text style={getTextStyle()}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
