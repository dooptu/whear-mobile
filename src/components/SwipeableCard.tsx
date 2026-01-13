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
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../hooks/useAppTheme';
import { AppText } from './AppText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.88;
const CARD_HEIGHT = CARD_WIDTH * 1.35;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const ZONE_WIDTH = SCREEN_WIDTH * 0.5; // Half screen width for zone spread

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
  onSwipeProgress?: (dx: number) => void; // Callback to update zone opacity
  style?: any;
}

export const SwipeableCard = memo(function SwipeableCard({
  outfit,
  isActive,
  onSwipeLeft,
  onSwipeRight,
  onSwipeProgress,
  style,
}: Props) {
  const { borderRadius, blur } = useAppTheme();

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(isActive ? 1 : 0.92)).current;
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;
  const likeZoneOpacity = useRef(new Animated.Value(0)).current; // Neon green zone
  const nopeZoneOpacity = useRef(new Animated.Value(0)).current; // Neon red zone
  const isSwipingRef = useRef(false);

  // Memoize callbacks
  const handleSwipeLeft = useCallback(() => {
    onSwipeLeft();
  }, [onSwipeLeft]);

  const handleSwipeRight = useCallback(() => {
    onSwipeRight();
  }, [onSwipeRight]);

  // Update scale when isActive changes
  useEffect(() => {
    if (isActive) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        stiffness: 200,
      }).start();
    } else {
      Animated.spring(scale, {
        toValue: 0.92,
        useNativeDriver: true,
        damping: 15,
        stiffness: 200,
      }).start();
    }
  }, [isActive, scale]);

  // Reset card position when it becomes inactive (but only if not currently swiping)
  useEffect(() => {
    if (!isActive && !isSwipingRef.current) {
      translateX.setValue(0);
      translateY.setValue(0);
      likeOpacity.setValue(0);
      nopeOpacity.setValue(0);
      likeZoneOpacity.setValue(0);
      nopeZoneOpacity.setValue(0);
    }
  }, [isActive, translateX, translateY, likeOpacity, nopeOpacity, likeZoneOpacity, nopeZoneOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isActive && !isSwipingRef.current,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!isActive || isSwipingRef.current) return false;
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        if (!isActive || isSwipingRef.current) return;
        isSwipingRef.current = true;
        translateX.stopAnimation();
        translateY.stopAnimation();
        const currentX = (translateX as any)._value || 0;
        const currentY = (translateY as any)._value || 0;
        translateX.setOffset(currentX);
        translateY.setOffset(currentY);
        translateX.setValue(0);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (!isActive || !isSwipingRef.current) return;
        
        translateX.setValue(gestureState.dx);
        translateY.setValue(gestureState.dy * 0.2);

        const xValue = gestureState.dx;
        const threshold = SWIPE_THRESHOLD * 0.5; // Threshold để vùng màu bắt đầu xuất hiện
        const maxOpacity = 0.6; // Max opacity for zone
        
        // Notify parent about swipe progress
        if (onSwipeProgress) {
          onSwipeProgress(xValue);
        }
        
        if (xValue > threshold) {
          // Swiping right - show green neon zone and like label
          // Zone appears when swipe exceeds threshold
          const progress = (xValue - threshold) / (SWIPE_THRESHOLD - threshold);
          const opacity = Math.min(1, progress);
          likeOpacity.setValue(opacity);
          nopeOpacity.setValue(0);
        } else if (xValue < -threshold) {
          // Swiping left - show red neon zone and nope label
          // Zone appears when swipe exceeds threshold
          const progress = (-xValue - threshold) / (SWIPE_THRESHOLD - threshold);
          const opacity = Math.min(1, progress);
          nopeOpacity.setValue(opacity);
          likeOpacity.setValue(0);
        } else {
          // Below threshold - hide zones
          likeOpacity.setValue(0);
          nopeOpacity.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!isActive || !isSwipingRef.current) return;
        
        translateX.flattenOffset();
        translateY.flattenOffset();

        const dx = gestureState.dx;
        const velocityX = gestureState.vx;
        const shouldLeft = dx < -SWIPE_THRESHOLD || (dx < -50 && velocityX < -0.5);
        const shouldRight = dx > SWIPE_THRESHOLD || (dx > 50 && velocityX > 0.5);

        if (shouldLeft) {
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -SCREEN_WIDTH * 1.5,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: gestureState.dy * 0.3,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(nopeOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(nopeZoneOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Call handler first - parent will handle removal and state transition
            handleSwipeLeft();
            // Don't reset translateX/translateY here - let card stay off-screen
            // Reset opacity values only
            likeOpacity.setValue(0);
            nopeOpacity.setValue(0);
            likeZoneOpacity.setValue(0);
            nopeZoneOpacity.setValue(0);
          });
          return;
        }

        if (shouldRight) {
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: SCREEN_WIDTH * 1.5,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: gestureState.dy * 0.3,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(likeOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(likeZoneOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Call handler first - parent will handle removal and state transition
            handleSwipeRight();
            // Don't reset translateX/translateY here - let card stay off-screen
            // Reset opacity values only
            likeOpacity.setValue(0);
            nopeOpacity.setValue(0);
            likeZoneOpacity.setValue(0);
            nopeZoneOpacity.setValue(0);
          });
          return;
        }

        // Spring back to center if not reached threshold
        // Reset all values smoothly back to original position
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            damping: 18,
            stiffness: 250,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 18,
            stiffness: 250,
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
          Animated.timing(likeZoneOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(nopeZoneOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Ensure all values are reset to 0
          translateX.setValue(0);
          translateY.setValue(0);
          likeOpacity.setValue(0);
          nopeOpacity.setValue(0);
          likeZoneOpacity.setValue(0);
          nopeZoneOpacity.setValue(0);
          isSwipingRef.current = false;
        });
      },
      onPanResponderTerminate: () => {
        if (!isActive || !isSwipingRef.current) return;
        
        translateX.flattenOffset();
        translateY.flattenOffset();
        
        // Spring back to center when gesture is terminated
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            damping: 18,
            stiffness: 250,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 18,
            stiffness: 250,
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
          Animated.timing(likeZoneOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(nopeZoneOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Ensure all values are reset to 0
          translateX.setValue(0);
          translateY.setValue(0);
          likeOpacity.setValue(0);
          nopeOpacity.setValue(0);
          likeZoneOpacity.setValue(0);
          nopeZoneOpacity.setValue(0);
          isSwipingRef.current = false;
        });
      },
    })
  ).current;

  // Calculate rotation
  const rotate = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-15deg', '0deg', '15deg'],
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
    <View style={[styles.container, style]} collapsable={false} pointerEvents="box-none">

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
          cachePolicy="memory-disk"
          recyclingKey={outfit.id}
          priority="high"
        />

        {/* Gradient overlay bottom */}
        <View style={styles.bottomScrim} />

        {/* Labels */}
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

        {/* Content */}
        <View style={styles.content} pointerEvents="box-none">
          <AppText overlay variant="h1" numberOfLines={1} style={styles.title}>
            {outfit.title}
          </AppText>
          <AppText overlay muted variant="h2" numberOfLines={1} style={styles.subtitle}>
            {outfit.subtitle}
          </AppText>

          <AppText overlay muted variant="tiny" style={styles.handle}>
            {outfit.handle}
          </AppText>

          <AppText overlay muted variant="caption" numberOfLines={2} style={styles.reason}>
            Because: {outfit.reason}
          </AppText>

          {/* CTA buttons */}
          <View style={styles.ctaRow} pointerEvents="box-none">
            <TouchableOpacity activeOpacity={0.8} style={styles.cta} onPress={() => {}}>
              {Platform.OS === 'ios' ? (
                <BlurView intensity={blur.medium} tint="light" style={styles.ctaInner}>
                  <AppText overlay variant="caption" style={styles.ctaText}>
                    Details
                  </AppText>
                </BlurView>
              ) : (
                <View style={[styles.ctaInner, styles.ctaAndroid]}>
                  <AppText overlay variant="caption" style={styles.ctaText}>
                    Details
                  </AppText>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={styles.cta} onPress={() => {}}>
              {Platform.OS === 'ios' ? (
                <BlurView intensity={blur.medium} tint="light" style={styles.ctaInner}>
                  <AppText overlay variant="caption" style={styles.ctaText}>
                    Wear Today
                  </AppText>
                </BlurView>
              ) : (
                <View style={[styles.ctaInner, styles.ctaAndroid]}>
                  <AppText overlay variant="caption" style={styles.ctaText}>
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
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
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
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  labelWrap: {
    position: 'absolute',
    top: 24,
    zIndex: 10,
  },
  labelLeft: { left: 20 },
  labelRight: { right: 20 },
  labelPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  labelText: {
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 13,
  },
  content: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
  },
  title: {
    fontWeight: '900',
    fontSize: 28,
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 4,
    fontWeight: '600',
    fontSize: 18,
  },
  handle: {
    marginTop: 8,
    fontWeight: '500',
  },
  reason: {
    marginTop: 12,
    lineHeight: 20,
  },
  ctaRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 12,
  },
  cta: {
    flex: 1,
    borderRadius: 999,
    overflow: 'hidden',
  },
  ctaInner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaAndroid: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ctaText: {
    fontWeight: '800',
    fontSize: 14,
  },
  neonZoneScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: ZONE_WIDTH,
    height: SCREEN_HEIGHT, // Full screen height
    zIndex: 99999, // Highest zIndex to be above all cards
    overflow: 'hidden',
  },
  neonZoneRight: {
    right: 0,
    alignItems: 'flex-end',
  },
  neonZoneLeft: {
    left: 0,
    alignItems: 'flex-start',
  },
  neonZoneGradientRight: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // Create ellipse shape using border radius - half ellipse from right edge
    borderTopLeftRadius: SCREEN_HEIGHT,
    borderBottomLeftRadius: SCREEN_HEIGHT,
  },
  neonZoneGradientLeft: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // Create ellipse shape using border radius - half ellipse from left edge
    borderTopRightRadius: SCREEN_HEIGHT,
    borderBottomRightRadius: SCREEN_HEIGHT,
  },
  neonZoneContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  neonZoneText: {
    fontWeight: '900',
    fontSize: 24,
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
