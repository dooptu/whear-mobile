import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface AppTextProps extends TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'tiny';
  color?: string;
  overlay?: boolean; // For text overlays on images
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  overlay = false,
  style,
  children,
  ...props
}) => {
  const { colors, typography } = useAppTheme();
  
  let textColor = color || colors.textPrimary;
  if (overlay) {
    textColor = color || colors.textOverlay;
  }

  const textStyle = [
    typography[variant],
    { color: textColor },
    overlay && {
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};
