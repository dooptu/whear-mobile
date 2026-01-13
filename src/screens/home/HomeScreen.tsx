import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText } from '../../components/AppText';
import { SwipeableCard } from '../../components/SwipeableCard';
import { ArcCarousel } from '../../components/ArcCarousel';
import { MainStackParamList } from '../../navigation/types';
import { ROUTES } from '../../constants/routes';
import { useTodayCollectionStore } from '../../stores/todayCollectionStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export interface OutfitSuggestion {
  id: string;
  imageUri: string;
  title: string;
  subtitle: string;
  handle: string;
  reason: string;
  bgGradient: [string, string, string];
  isAccepted?: boolean;
  isRejected?: boolean;
}

// Optimize image URLs
const img = (u: string) => u.replace('w=1200', 'w=900');

const mockOutfits: OutfitSuggestion[] = [
  {
    id: '1',
    imageUri: img('https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&auto=format&fit=crop'),
    title: 'Body language',
    subtitle: 'with maya daryen',
    handle: '@maya.daryen',
    reason: 'Hot day + Casual + Light fabric',
    bgGradient: ['#B9B0AC', '#C7C0BD', '#D8D6D3'],
  },
  {
    id: '2',
    imageUri: img('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop'),
    title: 'Office Ready',
    subtitle: 'polished silhouette',
    handle: '@workwear.daily',
    reason: 'Work day + Smart + Comfortable',
    bgGradient: ['#B7B1B2', '#CFC8C9', '#EAE6E6'],
  },
  {
    id: '3',
    imageUri: img('https://images.unsplash.com/photo-1520975732144-442d66dffb6e?w=1200&auto=format&fit=crop'),
    title: 'Layered Comfort',
    subtitle: 'transitional fit',
    handle: '@layers.club',
    reason: 'Cool day + Versatile + Layered',
    bgGradient: ['#B8B7B4', '#D2D1CD', '#F0EFEC'],
  },
  {
    id: '4',
    imageUri: img('https://images.unsplash.com/photo-1520975867722-01286f6abf7d?w=1200&auto=format&fit=crop'),
    title: 'Bold Statement',
    subtitle: 'make an impact',
    handle: '@bold.room',
    reason: 'Special + Bold + Confident',
    bgGradient: ['#B9B2B8', '#D4CFD6', '#F1EEF3'],
  },
  {
    id: '5',
    imageUri: img('https://images.unsplash.com/photo-1520975747456-4097f9c2a5c2?w=1200&auto=format&fit=crop'),
    title: 'Evening Elegance',
    subtitle: 'date-night glow',
    handle: '@night.edit',
    reason: 'Evening + Date + Elegant',
    bgGradient: ['#B5B2B0', '#CDC7C4', '#EEEAE7'],
  },
  {
    id: '6',
    imageUri: img('https://images.unsplash.com/photo-1520975904416-6fd35a5a8e3a?w=1200&auto=format&fit=crop'),
    title: 'Summer Breeze',
    subtitle: 'light drape',
    handle: '@summer.set',
    reason: 'Sunny + Casual + Airy',
    bgGradient: ['#B8C6D4', '#D5E0EA', '#F3F6FA'],
  },
  {
    id: '7',
    imageUri: img('https://images.unsplash.com/photo-1520975833856-63c8c9e98a4a?w=1200&auto=format&fit=crop'),
    title: 'Street Clean',
    subtitle: 'quiet luxury',
    handle: '@street.clean',
    reason: 'City + Neutral + Crisp',
    bgGradient: ['#B9B7C0', '#D7D5DF', '#F4F3F7'],
  },
  {
    id: '8',
    imageUri: img('https://images.unsplash.com/photo-1520975747456-4097f9c2a5c2?w=1200&auto=format&fit=crop'),
    title: 'Minimalist Chic',
    subtitle: 'less is more',
    handle: '@studio.line',
    reason: 'Any day + Minimal + Timeless',
    bgGradient: ['#BFC7D1', '#D7DCE3', '#F0F1F3'],
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, borderRadius, blur } = useAppTheme();
  const { addAccepted, removeAccepted } = useTodayCollectionStore();

  const [outfits, setOutfits] = useState<OutfitSuggestion[]>(mockOutfits);
  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState<Array<{ index: number; action: 'left' | 'right' }>>([]);
  
  // Use ref to prevent stale closures
  const isProcessingRef = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      if (parent) parent.setOptions({ tabBarStyle: { display: 'none' } });
      return () => {
        if (parent) parent.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );

  // Prefetch images asynchronously without blocking
  useEffect(() => {
    const prefetchImages = async () => {
      const urls = outfits.slice(0, 5).map((o) => o.imageUri);
      try {
        await Promise.all(urls.map(url => Image.prefetch(url).catch(() => {})));
      } catch (error) {
        // Silently fail - images will load on demand
      }
    };
    prefetchImages();
  }, [outfits]);

  const active = outfits[activeIndex];
  const bg = useMemo(
    () => active?.bgGradient ?? (colors.backgroundGradient as any),
    [active?.bgGradient, colors.backgroundGradient]
  );

  // Memoize callbacks to prevent unnecessary re-renders
  const goNext = useCallback(() => {
    setActiveIndex((prev) => {
      const next = Math.min(prev + 1, outfits.length - 1);
      return next;
    });
  }, [outfits.length]);

  const onLeft = useCallback(() => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    const current = outfits[activeIndex];
    if (!current) {
      isProcessingRef.current = false;
      return;
    }

    setOutfits((prev) =>
      prev.map((o) => (o.id === current.id ? { ...o, isRejected: true, isAccepted: false } : o))
    );
    setHistory((prev) => [...prev, { index: activeIndex, action: 'left' }]);
    
    // Use setTimeout to ensure state updates complete before moving to next
    setTimeout(() => {
      goNext();
      isProcessingRef.current = false;
    }, 100);
  }, [activeIndex, outfits, goNext]);

  const onRight = useCallback(() => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    const current = outfits[activeIndex];
    if (!current) {
      isProcessingRef.current = false;
      return;
    }

    setOutfits((prev) =>
      prev.map((o) => (o.id === current.id ? { ...o, isAccepted: true, isRejected: false } : o))
    );
    addAccepted(current);
    setHistory((prev) => [...prev, { index: activeIndex, action: 'right' }]);
    
    setTimeout(() => {
      goNext();
      isProcessingRef.current = false;
    }, 100);
  }, [activeIndex, outfits, goNext, addAccepted]);

  const undo = useCallback(() => {
    if (!history.length || isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    const last = history[history.length - 1];
    const item = outfits[last.index];
    if (!item) {
      isProcessingRef.current = false;
      return;
    }

    if (last.action === 'right') {
      removeAccepted(item.id);
    }

    setHistory((prev) => prev.slice(0, -1));
    setOutfits((prev) =>
      prev.map((o, idx) => (idx === last.index ? { ...o, isAccepted: false, isRejected: false } : o))
    );
    setActiveIndex(last.index);
    
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 100);
  }, [history, outfits, removeAccepted]);

  const next = useCallback(() => {
    const acceptedIds = outfits.filter((o) => o.isAccepted).map((o) => o.id);
    navigation.navigate(ROUTES.OUTFIT_HISTORY, { 
      mode: 'today', 
      acceptedIds 
    });
  }, [outfits, navigation]);

  // Only render visible cards (max 2 for performance)
  const visibleCards = useMemo(
    () => outfits.slice(activeIndex, activeIndex + 2),
    [outfits, activeIndex]
  );
  const cardOffset = 8;

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={bg} 
        start={{ x: 0.15, y: 0 }} 
        end={{ x: 0.85, y: 1 }} 
        style={StyleSheet.absoluteFill} 
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
          <AppText variant="display" overlay style={{ fontWeight: '800' }}>
            Today
          </AppText>

          <View style={styles.headerRight}>
            <View style={[styles.pill, { borderColor: colors.glassBorder }]}>
              {Platform.OS === 'ios' ? (
                <BlurView intensity={blur.medium} tint="light" style={styles.pillInner}>
                  <AppText overlay variant="caption" style={{ fontWeight: '700' }}>
                    Hot 🔥
                  </AppText>
                </BlurView>
              ) : (
                <View style={[styles.pillInner, styles.pillAndroid]}>
                  <AppText overlay variant="caption" style={{ fontWeight: '700' }}>
                    Hot 🔥
                  </AppText>
                </View>
              )}
            </View>

            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={next} 
              style={[styles.pill, { borderColor: colors.glassBorder }]}
            >
              {Platform.OS === 'ios' ? (
                <BlurView intensity={blur.medium} tint="light" style={[styles.pillInner, { paddingHorizontal: 14 }]}>
                  <AppText overlay variant="body" style={{ fontWeight: '800' }}>
                    Next →
                  </AppText>
                </BlurView>
              ) : (
                <View style={[styles.pillInner, styles.pillAndroid, { paddingHorizontal: 14 }]}>
                  <AppText overlay variant="body" style={{ fontWeight: '800' }}>
                    Next →
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Undo */}
        {history.length > 0 && (
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={undo} 
            style={[styles.undo, { borderColor: colors.glassBorder, borderRadius: borderRadius.full }]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView intensity={blur.medium} tint="light" style={styles.undoInner}>
                <Icon name="undo" size={20} color="rgba(255,255,255,0.92)" />
              </BlurView>
            ) : (
              <View style={[styles.undoInner, styles.undoAndroid]}>
                <Icon name="undo" size={20} color="rgba(255,255,255,0.92)" />
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Card stack */}
        <View style={styles.cardZone} pointerEvents="box-none">
          {visibleCards.map((o, idx) => (
            <SwipeableCard
              key={o.id}
              outfit={o}
              isActive={idx === 0}
              onSwipeLeft={onLeft}
              onSwipeRight={onRight}
              style={{
                zIndex: 20 - idx,
                transform: [
                  { translateX: idx * cardOffset - cardOffset }, 
                  { translateY: idx * cardOffset }
                ],
              }}
            />
          ))}
        </View>

        <ArcCarousel 
          items={outfits} 
          activeIndex={activeIndex} 
          onItemPress={(index) => {
            if (!isProcessingRef.current) {
              setActiveIndex(index);
            }
          }} 
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingTop: 10, 
    paddingBottom: 18,
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10,
  },

  pill: { 
    borderWidth: 1, 
    borderRadius: 999, 
    overflow: 'hidden',
  },
  pillInner: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  pillAndroid: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  undo: { 
    position: 'absolute', 
    left: 18, 
    top: 108, 
    width: 42, 
    height: 42, 
    overflow: 'hidden', 
    borderWidth: 1, 
    zIndex: 200,
  },
  undoInner: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  undoAndroid: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  cardZone: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: 12,
  },
});

HomeScreen.displayName = 'HomeScreen';

export { HomeScreen };
