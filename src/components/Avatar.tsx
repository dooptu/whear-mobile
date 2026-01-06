import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 40,
}) => {
  const { colors, borderRadius } = useAppTheme();

  if (uri) {
    return (
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: colors.glassBorder,
            overflow: 'hidden',
          },
        ]}
      >
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      </View>
    );
  }

  if (name) {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.accentLight,
            borderWidth: 2,
            borderColor: colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text
          style={[
            styles.initials,
            {
              color: colors.accent,
              fontSize: size * 0.4,
              fontWeight: '700',
            },
          ]}
        >
          {initials}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.glassSurface,
          borderWidth: 2,
          borderColor: colors.glassBorder,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '700',
  },
});
