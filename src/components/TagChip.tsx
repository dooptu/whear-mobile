import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface TagChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const TagChip: React.FC<TagChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
}) => {
  const { colors, typography, borderRadius, spacing } = useAppTheme();

  const containerStyle: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: selected ? colors.accent : colors.glassBorder,
    backgroundColor: selected ? colors.accentLight : 'transparent',
  };

  const textStyle: TextStyle = {
    ...typography.caption,
    color: selected ? colors.accent : colors.textSecondary,
    fontWeight: selected ? '600' : '400',
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[containerStyle, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
};
