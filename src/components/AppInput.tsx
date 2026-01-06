import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle, TextStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../hooks/useAppTheme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  placeholderTextColor,
  ...props
}) => {
  const { colors, typography, borderRadius, spacing, blur: blurAmount } = useAppTheme();

  const inputStyle: ViewStyle = {
    backgroundColor: colors.glassSurface,
    borderColor: error ? colors.error : colors.glassBorder,
    color: colors.textPrimary,
    borderRadius: borderRadius.sm,
    height: 48,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    ...typography.body,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }, typography.tiny]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[inputStyle, style]}
        placeholderTextColor={placeholderTextColor || colors.textSecondary}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.error }, typography.tiny]}>
          {error}
        </Text>
      )}
    </View>
  );
};

// AppInput.Icon removed - no longer needed

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    overflow: 'hidden',
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    // Styles applied inline
  },
  error: {
    marginTop: 4,
    marginLeft: 4,
  },
});
