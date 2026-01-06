import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { AppText } from './AppText';

interface StoryChipProps {
  imageUri?: string;
  label?: string;
  active?: boolean;
  onPress?: () => void;
  size?: number;
  style?: ViewStyle;
}

export const StoryChip: React.FC<StoryChipProps> = ({
  imageUri,
  label,
  active = false,
  onPress,
  size = 64,
  style,
}) => {
  const { colors, borderRadius } = useAppTheme();

  const ringSize = size + 4;
  const ringColor = active ? colors.storyRingActive : colors.storyRing;

  const content = (
    <View style={[styles.container, { width: ringSize, height: ringSize }, style]}>
      {/* Outer ring */}
      <View
        style={[
          styles.ring,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderWidth: 2.5,
            borderColor: ringColor,
          },
        ]}
      />
      {/* Image container */}
      <View
        style={[
          styles.imageContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: '#FFFFFF',
          },
        ]}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.glassSurface }]} />
        )}
      </View>
      {label && (
        <AppText variant="tiny" style={styles.label} numberOfLines={1}>
          {label}
        </AppText>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  ring: {
    position: 'absolute',
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
  },
  label: {
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 80,
  },
});


