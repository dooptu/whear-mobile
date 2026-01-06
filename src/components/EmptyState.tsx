import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  message,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  // Check if icon is an emoji (single character) or an icon name
  const isEmoji = icon && icon.length === 1;

  return (
    <View style={styles.container}>
      {isEmoji ? (
        <Text style={styles.emojiIcon}>{icon}</Text>
      ) : (
        <Icon
          name={icon}
          size={64}
          color={colors.textSecondary}
        />
      )}
      <Text style={[styles.title, { color: colors.textPrimary }, typography.h2]}>
        {title}
      </Text>
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }, typography.body]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emojiIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
});
