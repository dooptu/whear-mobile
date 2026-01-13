import React, { memo, useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, PanResponder, Animated } from 'react-native';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../hooks/useAppTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Calculate radius to fit screen with equal padding on left/right
const HORIZONTAL_PADDING = 20; // Equal padding on both sides
const ARC_RADIUS = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2) / 2;
const THUMB = 56;
const CENTER = 72;
const MIN_ITEMS_FOR_HALF_CIRCLE = 5;

// Pivot point (center of rotation) - positioned below the screen
// This is the center point that all items rotate around
const PIVOT_Y_OFFSET = 500; // Distance below screen bottom
const PIVOT_X = SCREEN_WIDTH / 2; // Center horizontally
const PIVOT_Y = SCREEN_HEIGHT + PIVOT_Y_OFFSET; // Below screen

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
  const rotationRef = useRef(new Animated.Value(0)).current; // Rotation angle in degrees
  const startRotationRef = useRef(0);
  const isSpinningRef = useRef(false);
  const lastActiveIndexRef = useRef(activeIndex);
  const [currentRotation, setCurrentRotation] = useState(0);

  // Calculate if we should show full circle or half circle
  const shouldShowFullCircle = items.length >= MIN_ITEMS_FOR_HALF_CIRCLE * 2;
  const ARC_ANGLE = shouldShowFullCircle ? 360 : 180;
  
  // Show all items in a circle or half circle
  const visible = useMemo(() => {
    return items.map((_, idx) => idx);
  }, [items.length]);

  // Calculate angle step for even distribution around the circle
  const step = visible.length > 1 ? ARC_ANGLE / visible.length : 0;
  const startAngle = shouldShowFullCircle ? 0 : -ARC_ANGLE / 2;

  // Listen to rotation changes to update positions
  useEffect(() => {
    const listener = rotationRef.addListener(({ value }) => {
      setCurrentRotation(value);
    });
    return () => {
      rotationRef.removeListener(listener);
    };
  }, [rotationRef]);

  // Initialize rotation based on activeIndex
  useEffect(() => {
    if (lastActiveIndexRef.current !== activeIndex && !isSpinningRef.current) {
      const rotationStep = ARC_ANGLE / items.length;
      // Calculate target rotation to position active item at top
      let targetRotation;
      if (shouldShowFullCircle) {
        // For full circle, rotate so active item is at top (0 degrees)
        targetRotation = (360 - activeIndex * rotationStep) % 360;
      } else {
        // For half circle, rotate so active item is at center
        targetRotation = activeIndex * rotationStep;
      }
      Animated.spring(rotationRef, {
        toValue: targetRotation,
        useNativeDriver: false, // Must be false for custom transform calculations
        damping: 20,
        stiffness: 300,
        // Remove any conflicting properties
      }).start();
      lastActiveIndexRef.current = activeIndex;
    }
  }, [activeIndex, items.length, rotationRef, ARC_ANGLE, shouldShowFullCircle]);

  // Calculate position of each item around the circle using trigonometry
  // Items are positioned on a circle centered at the pivot point
  const getItemPosition = useCallback((index: number, rotationAngle: number = 0) => {
    if (visible.length === 1) {
      return { x: PIVOT_X, y: PIVOT_Y - ARC_RADIUS };
    }
    
    // Calculate the angle for this item
    const itemAngle = startAngle + index * step;
    // Add rotation to rotate the entire circle
    const totalAngle = itemAngle + rotationAngle;
    const rad = (totalAngle * Math.PI) / 180;
    
    // Calculate position using trigonometry
    // x = pivot_x + R * sin(θ)
    // y = pivot_y - R * cos(θ) (negative because y increases downward)
    const x = PIVOT_X + ARC_RADIUS * Math.sin(rad);
    const y = PIVOT_Y - ARC_RADIUS * Math.cos(rad);
    
    return { x, y };
  }, [visible.length, step, startAngle]);

  // Handle spin gesture - like old phone dial
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8;
      },
      onPanResponderGrant: () => {
        startRotationRef.current = (rotationRef as any)._value || 0;
        isSpinningRef.current = true;
      },
      onPanResponderMove: (_, gestureState) => {
        if (!isSpinningRef.current) return;
        
        // Calculate rotation based on drag distance
        // Convert horizontal drag to rotation angle
        // The sensitivity determines how much rotation per pixel
        const sensitivity = 0.5; // degrees per pixel
        const rotation = startRotationRef.current + gestureState.dx * sensitivity;
        rotationRef.setValue(rotation);
      },
      onPanResponderRelease: (_, gestureState) => {
        isSpinningRef.current = false;
        
        // Snap to nearest item based on rotation
        const currentRotationValue = (rotationRef as any)._value || 0;
        const rotationStep = ARC_ANGLE / items.length;
        
        // Normalize rotation to 0-360 range
        let normalizedRotation = currentRotationValue % 360;
        if (normalizedRotation < 0) normalizedRotation += 360;
        
        // For full circle, wrap around; for half circle, clamp to range
        let clampedRotation = shouldShowFullCircle 
          ? normalizedRotation % 360
          : Math.max(0, Math.min(ARC_ANGLE, normalizedRotation));
        
        // Find nearest item index
        // When circle rotates, we need to find which item is closest to the "active" position
        let nearestIndex;
        if (shouldShowFullCircle) {
          // For full circle, find which item is at top (0 degrees)
          nearestIndex = Math.round((360 - clampedRotation) / rotationStep) % items.length;
        } else {
          // For half circle, find which item is at the center
          const centerAngle = -ARC_ANGLE / 2;
          const adjustedRotation = clampedRotation - centerAngle;
          nearestIndex = Math.round(adjustedRotation / rotationStep) % items.length;
        }
        
        const clampedIndex = Math.max(0, Math.min(items.length - 1, nearestIndex));
        
        // Calculate target rotation to center the selected item
        let targetRotation;
        if (shouldShowFullCircle) {
          targetRotation = (360 - clampedIndex * rotationStep) % 360;
        } else {
          targetRotation = clampedIndex * rotationStep;
        }
        
        // Update active index
        if (clampedIndex !== activeIndex) {
          onItemPress(clampedIndex);
        }
        
        Animated.spring(rotationRef, {
          toValue: targetRotation,
          useNativeDriver: false,
          damping: 20,
          stiffness: 300,
          // Only use damping and stiffness, no other conflicting properties
        }).start(() => {
          lastActiveIndexRef.current = clampedIndex;
        });
      },
    })
  ).current;

  // Handle item click - ensure it updates the main card
  const handleItemPress = useCallback((index: number) => {
    if (index >= 0 && index < items.length && index !== activeIndex && !isSpinningRef.current) {
      const rotationStep = ARC_ANGLE / items.length;
      // Calculate target rotation to center the clicked item
      let targetRotation;
      if (shouldShowFullCircle) {
        targetRotation = (360 - index * rotationStep) % 360;
      } else {
        targetRotation = index * rotationStep;
      }
      
      Animated.spring(rotationRef, {
        toValue: targetRotation,
        useNativeDriver: false,
        damping: 20,
        stiffness: 300,
        // Only use damping and stiffness
      }).start(() => {
        lastActiveIndexRef.current = index;
      });
      
      onItemPress(index);
    }
  }, [items.length, activeIndex, onItemPress, rotationRef, ARC_ANGLE, shouldShowFullCircle]);

  return (
    <View pointerEvents="box-none" style={styles.wrap} {...panResponder.panHandlers}>
      {visible.map((realIndex) => {
        const item = items[realIndex];
        if (!item) return null;
        
        const isActive = realIndex === activeIndex;
        // Get position based on current rotation
        const { x, y } = getItemPosition(realIndex, currentRotation);

        const size = isActive ? CENTER : THUMB;
        // Calculate distance for opacity/scale
        const dist = Math.min(
          Math.abs(realIndex - activeIndex),
          Math.abs(realIndex - activeIndex + items.length),
          Math.abs(realIndex - activeIndex - items.length)
        );
        const opacity = dist === 0 ? 1 : dist === 1 ? 0.8 : dist === 2 ? 0.65 : dist === 3 ? 0.5 : 0.35;
        const scale = isActive ? 1 : 0.85;

        return (
          <View
            key={`${item.id}-${realIndex}`}
            style={[
              styles.item,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                // Position item using absolute positioning based on calculated coordinates
                left: x - size / 2,
                top: y - size / 2,
                transform: [{ scale }],
                opacity,
                zIndex: isActive ? 100 : 50 - dist,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.press}
              activeOpacity={0.85}
              onPress={() => handleItemPress(realIndex)}
              disabled={isSpinningRef.current}
            >
              {isActive && (
                <View
                  style={[
                    styles.ring,
                    {
                      width: size + 10,
                      height: size + 10,
                      borderRadius: (size + 10) / 2,
                      borderColor: colors.accent,
                    },
                  ]}
                />
              )}

              <Image
                source={{ uri: item.imageUri }}
                style={[
                  styles.image,
                  {
                    width: size - 10,
                    height: size - 10,
                    borderRadius: (size - 10) / 2,
                  },
                ]}
                contentFit="cover"
                transition={150}
                cachePolicy="memory-disk"
                recyclingKey={item.id}
                priority={isActive ? 'high' : 'normal'}
              />

              {item.isAccepted && (
                <View style={styles.badge}>
                  <Icon name="check" size={18} color={colors.success} />
                </View>
              )}
              {item.isRejected && (
                <View style={[styles.badge, styles.badgeReject]}>
                  <Icon name="close" size={18} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // Container covers entire screen to allow items to be positioned anywhere
  },
  item: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  press: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 3.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  image: {
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  badge: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  badgeReject: {
    backgroundColor: 'rgba(239,68,68,0.95)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
});
