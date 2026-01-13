import React, { memo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';

import { useAppTheme } from '../hooks/useAppTheme';
import { AppText } from './AppText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_HEIGHT = CARD_WIDTH * 1.28;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.26;

type Outfit = {
  id: string;
  imageUri: string;
  title: string;
  subtitle: string;
  handle: string;
  reason: string;
};

interface Props {
  outfit: Outfit;
  isActive: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  style?: any;
}

export const SwipeableCard = memo(function SwipeableCard({
  outfit,
  isActive,
  onSwipeLeft,
  onSwipeRight,
  style,
}: Props) {
  const { borderRadius, blur } = useAppTheme();

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(isActive ? 1 : 0.965)).current;
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;

  // Memoize callbacks to prevent recreation
  const handleSwipeLeft = useCallback(() => {
    onSwipeLeft();
  }, [onSwipeLeft]);

  const handleSwipeRight = useCallback(() => {
    onSwipeRight();
  }, [onSwipeRight]);

  // Update scale when isActive changes
  useEffect(() => {
    Animated.spring(scale, {
      toValue: isActive ? 1 : 0.965,
      useNativeDriver: true,
      damping: 14,
      stiffness: 180,
    }).start();
  }, [isActive, scale]);

  // Reset card position when it becomes inactive
  useEffect(() => {
    if (!isActive) {
      translateX.setValue(0);
      translateY.setValue(0);
      likeOpacity.setValue(0);
      nopeOpacity.setValue(0);
    }
  }, [isActive, translateX, translateY, likeOpacity, nopeOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isActive,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!isActive) return false;
        // Only activate if movement is significant
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        // Stop any ongoing animations
        translateX.stopAnimation();
        translateY.stopAnimation();
        // Set offset to current value
        translateX.setOffset((translateX as any)._value || 0);
        translateY.setOffset((translateY as any)._value || 0);
        translateX.setValue(0);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (!isActive) return;
        
        // Use setValue for immediate updates (native driver handles this efficiently)
        translateX.setValue(gestureState.dx);
        translateY.setValue(gestureState.dy * 0.22);

        // Calculate and update opacities efficiently
        const xValue = gestureState.dx;
        const threshold = SWIPE_THRESHOLD * 0.75;
        
        if (xValue > 0) {
          // Swiping right
          const opacity = Math.min(1, xValue / threshold);
          likeOpacity.setValue(opacity);
          nopeOpacity.setValue(0);
        } else if (xValue < 0) {
          // Swiping left
          const opacity = Math.min(1, -xValue / threshold);
          nopeOpacity.setValue(opacity);
          likeOpacity.setValue(0);
        } else {
          likeOpacity.setValue(0);
          nopeOpacity.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();
        translateY.flattenOffset();

        const dx = gestureState.dx;
        const shouldLeft = dx < -SWIPE_THRESHOLD;
        const shouldRight = dx > SWIPE_THRESHOLD;

        if (shouldLeft) {
          // Swipe left - animate off screen
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -SCREEN_WIDTH * 1.5,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: gestureState.dy * 0.3,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(nopeOpacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Reset after animation completes
            translateX.setValue(0);
            translateY.setValue(0);
            likeOpacity.setValue(0);
            nopeOpacity.setValue(0);
            handleSwipeLeft();
          });
          return;
        }

        if (shouldRight) {
          // Swipe right - animate off screen
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: SCREEN_WIDTH * 1.5,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: gestureState.dy * 0.3,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(likeOpacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Reset after animation completes
            translateX.setValue(0);
            translateY.setValue(0);
            likeOpacity.setValue(0);
            nopeOpacity.setValue(0);
            handleSwipeRight();
          });
          return;
        }

        // Spring back to center
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 200,
            tension: 100,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 200,
            tension: 100,
          }),
          Animated.timing(likeOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(nopeOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        // Handle interruption (e.g., by another gesture)
        translateX.flattenOffset();
        translateY.flattenOffset();
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 200,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 200,
          }),
        ]).start();
      },
    })
  ).current;

  // Calculate rotation based on translateX - use native driver compatible interpolation
  const rotate = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const cardStyle = {
    transform: [
      { translateX },
      { translateY },
      { rotate },
      { scale },
    ],
  };

  return (
    <View style={[styles.container, style]} collapsable={false}>
      <Animated.View
        style={[styles.card, { borderRadius: borderRadius.xl }, cardStyle]}
        {...(isActive ? panResponder.panHandlers : {})}
        collapsable={false}
      >
        <Image
          source={{ uri: outfit.imageUri }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="disk"
          recyclingKey={outfit.id}
          priority="high"
        />

        {/* soft scrim bottom */}
        <View style={styles.bottomScrim} />

        {/* labels */}
        <Animated.View 
          style={[styles.labelWrap, styles.labelRight, { opacity: likeOpacity }]}
          pointerEvents="none"
        >
          <View style={styles.labelPill}>
            <AppText overlay variant="caption" style={styles.labelText}>
              FIT TODAY ✓
            </AppText>
          </View>
        </Animated.View>

        <Animated.View 
          style={[styles.labelWrap, styles.labelLeft, { opacity: nopeOpacity }]}
          pointerEvents="none"
        >
          <View style={styles.labelPill}>
            <AppText overlay variant="caption" style={styles.labelText}>
              NOT TODAY ✕
            </AppText>
          </View>
        </Animated.View>

        {/* editorial text */}
        <View style={styles.content} pointerEvents="box-none">
          <AppText overlay variant="h1" numberOfLines={1} style={{ fontWeight: '800' }}>
            {outfit.title}
          </AppText>
          <AppText overlay muted variant="h2" numberOfLines={1} style={{ marginTop: 2 }}>
            {outfit.subtitle}
          </AppText>

          <AppText overlay muted variant="tiny" style={{ marginTop: 6 }}>
            {outfit.handle}
          </AppText>

          <AppText overlay muted variant="caption" numberOfLines={2} style={{ marginTop: 10 }}>
            Because: {outfit.reason}
          </AppText>

          {/* CTA buttons */}
          <View style={styles.ctaRow} pointerEvents="box-none">
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.cta}
              onPress={() => {}}
            >
              {Platform.OS === 'ios' ? (
                <BlurView intensity={blur.medium} tint="light" style={styles.ctaInner}>
                  <AppText overlay variant="caption" style={{ fontWeight: '700' }}>
                    Details
                  </AppText>
                </BlurView>
              ) : (
                <View style={[styles.ctaInner, styles.ctaAndroid]}>
                  <AppText overlay variant="caption" style={{ fontWeight: '700' }}>
                    Details
                  </AppText>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.cta}
              onPress={() => {}}
            >
              {Platform.OS === 'ios' ? (
                <BlurView intensity={blur.medium} tint="light" style={styles.ctaInner}>
                  <AppText overlay variant="caption" style={{ fontWeight: '700' }}>
                    Wear Today
                  </AppText>
                </BlurView>
              ) : (
                <View style={[styles.ctaInner, styles.ctaAndroid]}>
                  <AppText overlay variant="caption" style={{ fontWeight: '700' }}>
                    Wear Today
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if props actually change
  return (
    prevProps.outfit.id === nextProps.outfit.id &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.outfit.imageUri === nextProps.outfit.imageUri
  );
});

const styles = StyleSheet.create({
  container: { 
    position: 'absolute', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  image: { 
    width: '100%', 
    height: '100%',
  },

  bottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },

  labelWrap: { 
    position: 'absolute', 
    top: 20, 
    zIndex: 10,
  },
  labelLeft: { left: 16 },
  labelRight: { right: 16 },
  labelPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  labelText: { fontWeight: '800', letterSpacing: 0.6 },

  content: { 
    position: 'absolute', 
    left: 18, 
    right: 18, 
    bottom: 18,
  },
  ctaRow: { 
    marginTop: 14, 
    flexDirection: 'row', 
    gap: 10,
  },
  cta: { 
    flex: 1, 
    borderRadius: 999, 
    overflow: 'hidden',
  },
  ctaInner: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaAndroid: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
});
