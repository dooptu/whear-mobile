import React, { memo, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../hooks/useAppTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ARC_RADIUS = SCREEN_WIDTH * 0.58;
const ARC_ANGLE = 118;
const THUMB = 52;
const CENTER = 70;

type Item = {
  id: string;
  imageUri: string;
  isAccepted?: boolean;
  isRejected?: boolean;
};

export const ArcCarousel = memo(function ArcCarousel({
  items,
  activeIndex,
  onItemPress,
}: {
  items: Item[];
  activeIndex: number;
  onItemPress: (index: number) => void;
}) {
  const { colors } = useAppTheme();

  const visibleRange = 4; // show max 9 thumbs
  const visible = useMemo(() => {
    const start = Math.max(0, activeIndex - visibleRange);
    const end = Math.min(items.length - 1, activeIndex + visibleRange);
    const idxs: number[] = [];
    for (let i = start; i <= end; i++) idxs.push(i);
    return idxs;
  }, [activeIndex, items.length]);

  const step = ARC_ANGLE / Math.max(1, visible.length - 1);
  const startAngle = -ARC_ANGLE / 2;

  const pos = (slot: number) => {
    const angle = startAngle + slot * step;
    const rad = (angle * Math.PI) / 180;
    const x = ARC_RADIUS * Math.sin(rad);
    const y = ARC_RADIUS * (1 - Math.cos(rad));
    return { x, y };
  };

  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <View style={styles.center}>
        {visible.map((realIndex, slot) => {
          const item = items[realIndex];
          const isActive = realIndex === activeIndex;
          const { x, y } = pos(slot);

          const size = isActive ? CENTER : THUMB;
          const dist = Math.abs(realIndex - activeIndex);
          const opacity = dist === 0 ? 1 : dist === 1 ? 0.75 : dist === 2 ? 0.55 : 0.35;

          return (
            <View
              key={item.id}
              style={[
                styles.item,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  transform: [{ translateX: x }, { translateY: y }],
                  opacity,
                },
              ]}
            >
              <TouchableOpacity style={styles.press} activeOpacity={0.9} onPress={() => onItemPress(realIndex)}>
                {isActive && (
                  <View
                    style={[
                      styles.ring,
                      {
                        width: size + 6,
                        height: size + 6,
                        borderRadius: (size + 6) / 2,
                        borderColor: colors.accent,
                      },
                    ]}
                  />
                )}

                <Image
                  source={{ uri: item.imageUri }}
                  style={{
                    width: size - 6,
                    height: size - 6,
                    borderRadius: (size - 6) / 2,
                  }}
                  contentFit="cover"
                  transition={120}
                  cachePolicy="disk"
                  recyclingKey={item.id}
                />

                {item.isAccepted && (
                  <View style={styles.badge}>
                    <Icon name="check" size={14} color={colors.success} />
                  </View>
                )}
                {item.isRejected && (
                  <View style={[styles.badge, styles.badgeReject]}>
                    <Icon name="close" size={14} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 18, alignItems: 'center' },
  center: { width: ARC_RADIUS * 2, height: ARC_RADIUS * 0.92, alignItems: 'center', justifyContent: 'center' },
  item: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  press: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderWidth: 2, backgroundColor: 'rgba(255,255,255,0.06)' },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeReject: { backgroundColor: 'rgba(239,68,68,0.92)' },
});
