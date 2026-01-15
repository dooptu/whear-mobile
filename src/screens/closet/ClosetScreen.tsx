import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, LoadingSpinner, EmptyState, TagChip, GradientBackground, StoryChip, Avatar, BottomNavigationBar } from '../../components';
import { ROUTES, TAB_ROUTES } from '../../constants/routes';
import { MainTabParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useClosetStore } from '../../features/closetStore';
import { ClosetItem, ItemCategory } from '../../models';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';

type NavigationProp = BottomTabNavigationProp<MainTabParamList>;

const categories: ItemCategory[] = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory', 'bag', 'other'];

export const ClosetScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { items, isLoading, viewMode, filters, fetchItems, setViewMode, setFilters } = useClosetStore();
  const { colors, spacing, borderRadius, blur, isDark } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = React.useState<ItemCategory | 'all'>('all');
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user) {
      fetchItems(user.id);
    }
  }, [user]);

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (filters.color && item.colors && !item.colors.includes(filters.color)) return false;
    if (filters.tag && item.tags && !item.tags.includes(filters.tag)) return false;
    return true;
  });

  const renderItem = ({ item, index }: { item: ClosetItem; index: number }) => {
    const isGrid = viewMode === 'grid';

    if (isGrid) {
      // Masonry-style grid with varying sizes
      const isLarge = index % 7 === 0 || index % 7 === 3;

      return (
        <TouchableOpacity
          style={[
            styles.gridItem,
            isLarge ? styles.gridItemLarge : styles.gridItemSmall,
            { margin: spacing.sm },
          ]}
          onPress={() => {
            const parent = navigation.getParent();
            if (parent) {
              (parent as any).navigate(ROUTES.ITEM_DETAIL, { itemId: item.id });
            }
          }}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: item.imageUri }}
            style={[styles.gridImage, { borderRadius: borderRadius.lg }]}
            resizeMode="cover"
          />
          <View style={[styles.gridOverlay, { borderRadius: borderRadius.lg }]}>
            {item.colors && item.colors.length > 0 && (
              <View style={styles.gridChips}>
                {item.colors.slice(0, 2).map((color, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.gridChip,
                      { backgroundColor: `${colors.glassSurface}E6` },
                    ]}
                  >
                    <Text style={[styles.gridChipText, { color: colors.textPrimary }]}>
                      {color}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.listItem,
          {
            backgroundColor: colors.glassSurface,
            borderBottomColor: colors.glassBorder,
            borderRadius: borderRadius.lg,
            marginHorizontal: spacing.lg,
            marginBottom: spacing.md,
          },
        ]}
        onPress={() => {
          const parent = navigation.getParent();
          if (parent) {
            (parent as any).navigate(ROUTES.ITEM_DETAIL, { itemId: item.id });
          }
        }}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.imageUri }}
          style={[styles.listImage, { borderRadius: borderRadius.lg }]}
          resizeMode="cover"
        />
        <View style={styles.listItemInfo}>
          <AppText variant="body" style={{ fontWeight: '600', marginBottom: spacing.xs }}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </AppText>
          {item.colors && item.colors.length > 0 && (
            <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
              {item.colors.slice(0, 3).join(' • ')}
            </AppText>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && items.length === 0) {
    return (
      <GradientBackground>
        <LoadingSpinner />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <View style={{ width: 46 }} />
          <AppText variant="display" style={{ fontWeight: '700', color: colors.textPrimary }}>My Closet</AppText>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              style={[styles.headerButton, { borderColor: colors.glassBorder, borderRadius: borderRadius.full }]}
            >
              {Platform.OS === 'ios' ? (
                <BlurView intensity={blur.medium} tint={isDark ? 'dark' : 'light'} style={styles.headerButtonInner}>
                  <Text style={[styles.headerIcon, { color: colors.textPrimary }]}>
                    {viewMode === 'grid' ? '☰' : '⊞'}
                  </Text>
                </BlurView>
              ) : (
                <View style={[styles.headerButtonInner, { backgroundColor: colors.glassSurface }]}>
                  <Text style={[styles.headerIcon, { color: colors.textPrimary }]}>
                    {viewMode === 'grid' ? '☰' : '⊞'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const parent = navigation.getParent();
                if (parent) {
                  (parent as any).navigate(ROUTES.ADD_ITEM);
                }
              }}
              style={[styles.headerButton, { borderColor: colors.glassBorder, borderRadius: borderRadius.full }]}
            >
              {Platform.OS === 'ios' ? (
                <BlurView intensity={blur.medium} tint={isDark ? 'dark' : 'light'} style={styles.headerButtonInner}>
                  <Text style={[styles.headerIcon, { color: colors.textPrimary }]}>+</Text>
                </BlurView>
              ) : (
                <View style={[styles.headerButtonInner, { backgroundColor: colors.glassSurface }]}>
                  <Text style={[styles.headerIcon, { color: colors.textPrimary }]}>+</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(TAB_ROUTES.PROFILE);
              }}
              style={[styles.headerButton, { borderColor: colors.glassBorder, borderRadius: borderRadius.full }]}
            >
              {Platform.OS === 'ios' ? (
                <BlurView intensity={blur.medium} tint={isDark ? 'dark' : 'light'} style={styles.headerButtonInner}>
                  <Avatar name={user?.name || 'U'} size={28} />
                </BlurView>
              ) : (
                <View style={[styles.headerButtonInner, { backgroundColor: colors.glassSurface }]}>
                  <Avatar name={user?.name || 'U'} size={28} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Story-style Category Filter */}
        <View style={[styles.categoryBar, { paddingVertical: spacing.md }]}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={['all', ...categories]}
            keyExtractor={(item) => item}
            renderItem={({ item: cat }) => {
              const isSelected = selectedCategory === cat;
              return (
                <StoryChip
                  label={cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  active={isSelected}
                  onPress={() => {
                    setSelectedCategory(cat as ItemCategory | 'all');
                    setFilters({ ...filters, category: cat === 'all' ? undefined : (cat as ItemCategory) });
                  }}
                  size={56}
                />
              );
            }}
            contentContainerStyle={[styles.categoryBarContent, { paddingHorizontal: spacing.lg }]}
          />
        </View>

        {/* Items Grid/List */}
        {filteredItems.length === 0 ? (
          <EmptyState
            icon="package-variant"
            title="No items found"
            message="Add items to your closet to get started"
          />
        ) : (
          <Animated.FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 3 : 1}
            contentContainerStyle={viewMode === 'grid' ? styles.gridList : styles.listList}
            key={viewMode}
            showsVerticalScrollIndicator={false}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingConstants.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacingConstants.md,
  },
  headerButton: {
    width: 46,
    height: 46,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  headerButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    fontWeight: '300',
  },
  categoryBar: {
    marginBottom: spacingConstants.md,
  },
  categoryBarContent: {
    gap: spacingConstants.sm,
  },
  gridList: {
    padding: spacingConstants.sm,
    paddingBottom: 100, // Extra padding for bottom navigation bar
  },
  listList: {
    paddingTop: spacingConstants.md,
    paddingBottom: 100, // Extra padding for bottom navigation bar
  },
  gridItem: {
    overflow: 'hidden',
  },
  gridItemSmall: {
    width: '32%',
    height: 150,
  },
  gridItemLarge: {
    width: '66%',
    height: 200,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingConstants.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  gridChips: {
    flexDirection: 'row',
    gap: spacingConstants.xs,
    flexWrap: 'wrap',
  },
  gridChip: {
    paddingHorizontal: spacingConstants.sm,
    paddingVertical: spacingConstants.xs / 2,
    borderRadius: borderRadiusConstants.full,
  },
  gridChipText: {
    fontSize: 10,
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    padding: spacingConstants.lg,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  listImage: {
    width: 80,
    height: 80,
  },
  listItemInfo: {
    flex: 1,
    marginLeft: spacingConstants.lg,
    justifyContent: 'center',
  },
});

ClosetScreen.displayName = 'ClosetScreen';