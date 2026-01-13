import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface AppTextProps extends TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'tiny';
  color?: string;
  overlay?: boolean;
  muted?: boolean;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  overlay = false,
  muted = false,
  style,
  children,
  ...props
}) => {
  const { colors, typography } = useAppTheme();

  const baseColor = overlay
    ? muted
      ? colors.textOverlayMuted
      : colors.textOverlay
    : muted
    ? colors.textSecondary
    : colors.textPrimary;

  return (
    <Text
      style={[
        typography[variant],
        { color: color ?? baseColor },
        overlay && styles.overlayShadow,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  overlayShadow: {
    textShadowColor: 'rgba(0,0,0,0.28)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
});
