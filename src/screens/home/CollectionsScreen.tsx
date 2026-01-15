import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Icon = MaterialCommunityIcons;

import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, BottomNavigationBar } from '../../components';
import { GradientBackground } from '../../components';
import { MainStackParamList } from '../../navigation/types';
import { ROUTES } from '../../constants/routes';
import { useTodayCollectionStore } from '../../stores/todayCollectionStore';
import { OutfitSuggestion } from './WearTodayScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

type TabType = 'accepted' | 'rejected';

export const CollectionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, borderRadius, blur, isDark } = useAppTheme();
  const { accepted, rejected } = useTodayCollectionStore();
  const [activeTab, setActiveTab] = useState<TabType>('accepted');
  const scrollY = useRef(new Animated.Value(0)).current;

  const currentItems = activeTab === 'accepted' ? accepted : rejected;

  const renderItem = ({ item }: { item: OutfitSuggestion }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.card,
          {
            borderRadius: borderRadius.xl,
            backgroundColor: colors.cardBackground,
            shadowColor: isDark ? '#000' : '#000',
            shadowOpacity: isDark ? 0.4 : 0.2,
          }
        ]}
      >
        <Image
          source={{ uri: item.imageUri }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <View style={styles.cardContent}>
          <AppText overlay variant="h2" style={styles.cardTitle}>
            {item.title}
          </AppText>
          <AppText overlay muted variant="body" style={styles.cardSubtitle}>
            {item.subtitle}
          </AppText>
          <AppText overlay muted variant="caption" style={styles.cardHandle}>
            {item.handle}
          </AppText>
          <AppText overlay muted variant="caption" style={styles.cardReason}>
            {item.reason}
          </AppText>
        </View>
        {activeTab === 'accepted' && (
          <View style={[
            styles.badge,
            { backgroundColor: isDark ? 'rgba(34,197,94,0.95)' : 'rgba(255,255,255,0.95)' }
          ]}>
            <Icon name="check-circle" size={24} color={isDark ? '#fff' : colors.success} />
          </View>
        )}
        {activeTab === 'rejected' && (
          <View style={[styles.badge, styles.badgeReject]}>
            <Icon name="close-circle" size={24} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: spacing.xl, paddingTop: spacing.lg }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { borderColor: colors.glassBorder, borderRadius: borderRadius.full }]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView intensity={blur.medium} tint={isDark ? 'dark' : 'light'} style={styles.backButtonInner}>
                <Icon name="arrow-left" size={22} color={colors.textPrimary} />
              </BlurView>
            ) : (
              <View style={[styles.backButtonInner, { backgroundColor: colors.glassSurface }]}>
                <Icon name="arrow-left" size={22} color={colors.textPrimary} />
              </View>
            )}
          </TouchableOpacity>
          <AppText variant="display" style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Collections
          </AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.SOCIAL)}
            style={[styles.backButton, { borderColor: colors.glassBorder, borderRadius: borderRadius.full }]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView intensity={blur.medium} tint={isDark ? 'dark' : 'light'} style={styles.backButtonInner}>
                <Icon name="home" size={22} color={colors.textPrimary} />
              </BlurView>
            ) : (
              <View style={[styles.backButtonInner, { backgroundColor: colors.glassSurface }]}>
                <Icon name="home" size={22} color={colors.textPrimary} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, { paddingHorizontal: spacing.xl }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('accepted')}
            style={[
              styles.tab,
              {
                borderColor: activeTab === 'accepted' ? colors.accent : colors.glassBorder,
                borderRadius: borderRadius.full,
                backgroundColor: activeTab === 'accepted' ? colors.accent + '20' : 'transparent',
              },
              activeTab === 'accepted' && { borderWidth: 2 },
            ]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView
                intensity={blur.medium}
                tint={isDark ? 'dark' : 'light'}
                style={styles.tabInner}
              >
                <AppText
                  variant="body"
                  style={[
                    styles.tabText,
                    { color: activeTab === 'accepted' ? colors.accent : colors.textPrimary }
                  ]}
                >
                  Liked ({accepted.length})
                </AppText>
              </BlurView>
            ) : (
              <View style={[styles.tabInner, { backgroundColor: colors.glassSurface }]}>
                <AppText
                  variant="body"
                  style={[
                    styles.tabText,
                    { color: activeTab === 'accepted' ? colors.accent : colors.textPrimary }
                  ]}
                >
                  Liked ({accepted.length})
                </AppText>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('rejected')}
            style={[
              styles.tab,
              {
                borderColor: activeTab === 'rejected' ? colors.error : colors.glassBorder,
                borderRadius: borderRadius.full,
                backgroundColor: activeTab === 'rejected' ? colors.error + '20' : 'transparent',
              },
              activeTab === 'rejected' && { borderWidth: 2 },
            ]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView
                intensity={blur.medium}
                tint={isDark ? 'dark' : 'light'}
                style={styles.tabInner}
              >
                <AppText
                  variant="body"
                  style={[
                    styles.tabText,
                    { color: activeTab === 'rejected' ? colors.error : colors.textPrimary }
                  ]}
                >
                  Not Liked ({rejected.length})
                </AppText>
              </BlurView>
            ) : (
              <View style={[styles.tabInner, { backgroundColor: colors.glassSurface }]}>
                <AppText
                  variant="body"
                  style={[
                    styles.tabText,
                    { color: activeTab === 'rejected' ? colors.error : colors.textPrimary }
                  ]}
                >
                  Not Liked ({rejected.length})
                </AppText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* List */}
        {currentItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon
              name={activeTab === 'accepted' ? 'heart-outline' : 'heart-off-outline'}
              size={64}
              color={colors.textSecondary}
            />
            <AppText variant="h1" style={[styles.emptyTitle, { marginTop: spacing.lg, color: colors.textPrimary }]}>
              No {activeTab === 'accepted' ? 'Liked' : 'Rejected'} Outfits
            </AppText>
            <AppText variant="body" color={colors.textSecondary} style={styles.emptySubtitle}>
              {activeTab === 'accepted'
                ? "You haven't liked any outfits yet"
                : "You haven't rejected any outfits yet"}
            </AppText>
          </View>
        ) : (
          <Animated.FlatList
            data={currentItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.list, { padding: spacing.lg }]}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: false,
            })}
            scrollEventThrottle={16}
          />
        )}

        {/* Bottom Navigation Bar */}
        <BottomNavigationBar scrollY={scrollY} showOnScrollUp={true} />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 46,
    height: 46,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  backButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: -0.5,
  },
  tabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  tabInner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontWeight: '800',
    fontSize: 15,
  },
  list: {
    paddingBottom: 100, // Extra padding for bottom navigation bar
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: (SCREEN_WIDTH - 48 - 16) / 2,
    height: 280,
    overflow: 'hidden',
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  cardContent: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },
  cardTitle: {
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  cardHandle: {
    marginBottom: 6,
  },
  cardReason: {
    fontSize: 11,
    lineHeight: 14,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  badgeReject: {
    backgroundColor: 'rgba(239,68,68,0.95)',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});

CollectionsScreen.displayName = 'CollectionsScreen';

