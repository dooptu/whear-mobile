import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText } from '../../components/AppText';
import { GradientBackground } from '../../components';
import { MainStackParamList } from '../../navigation/types';
import { ROUTES } from '../../constants/routes';
import { useTodayCollectionStore } from '../../stores/todayCollectionStore';
import { OutfitSuggestion } from './HomeScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

type TabType = 'accepted' | 'rejected';

export const CollectionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, borderRadius, blur } = useAppTheme();
  const { accepted, rejected } = useTodayCollectionStore();
  const [activeTab, setActiveTab] = useState<TabType>('accepted');

  const currentItems = activeTab === 'accepted' ? accepted : rejected;

  const renderItem = ({ item }: { item: OutfitSuggestion }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.card, { borderRadius: borderRadius.xl }]}
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
          <View style={styles.badge}>
            <Icon name="check-circle" size={24} color={colors.success} />
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
              <BlurView intensity={blur.medium} tint="light" style={styles.backButtonInner}>
                <Icon name="arrow-left" size={22} color="rgba(255,255,255,0.95)" />
              </BlurView>
            ) : (
              <View style={[styles.backButtonInner, styles.backButtonAndroid]}>
                <Icon name="arrow-left" size={22} color="rgba(255,255,255,0.95)" />
              </View>
            )}
          </TouchableOpacity>
          <AppText overlay variant="display" style={styles.headerTitle}>
            Collections
          </AppText>
          <View style={{ width: 46 }} />
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, { paddingHorizontal: spacing.xl }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('accepted')}
            style={[
              styles.tab,
              { borderColor: colors.glassBorder, borderRadius: borderRadius.full },
              activeTab === 'accepted' && styles.tabActive,
            ]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView intensity={blur.medium} tint="light" style={styles.tabInner}>
                <AppText overlay variant="body" style={styles.tabText}>
                  Liked ({accepted.length})
                </AppText>
              </BlurView>
            ) : (
              <View style={[styles.tabInner, styles.tabAndroid]}>
                <AppText overlay variant="body" style={styles.tabText}>
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
              { borderColor: colors.glassBorder, borderRadius: borderRadius.full },
              activeTab === 'rejected' && styles.tabActive,
            ]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView intensity={blur.medium} tint="light" style={styles.tabInner}>
                <AppText overlay variant="body" style={styles.tabText}>
                  Not Liked ({rejected.length})
                </AppText>
              </BlurView>
            ) : (
              <View style={[styles.tabInner, styles.tabAndroid]}>
                <AppText overlay variant="body" style={styles.tabText}>
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
            <AppText variant="h1" style={[styles.emptyTitle, { marginTop: spacing.lg }]}>
              No {activeTab === 'accepted' ? 'Liked' : 'Rejected'} Outfits
            </AppText>
            <AppText variant="body" color={colors.textSecondary} style={styles.emptySubtitle}>
              {activeTab === 'accepted'
                ? "You haven't liked any outfits yet"
                : "You haven't rejected any outfits yet"}
            </AppText>
          </View>
        ) : (
          <FlatList
            data={currentItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.list, { padding: spacing.lg }]}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        )}
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
  backButtonAndroid: {
    backgroundColor: 'rgba(255,255,255,0.18)',
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
  tabActive: {
    borderWidth: 2,
  },
  tabInner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabAndroid: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  tabText: {
    fontWeight: '800',
    fontSize: 15,
  },
  list: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: (SCREEN_WIDTH - 48 - 16) / 2,
    height: 280,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
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
    backgroundColor: 'rgba(255,255,255,0.95)',
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

