import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, LoadingSpinner, EmptyState, TagChip, GradientBackground, StoryChip } from '../../components';
import { ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useClosetStore } from '../../features/closetStore';
import { ClosetItem, ItemCategory } from '../../models';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const categories: ItemCategory[] = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory', 'bag', 'other'];

export const ClosetScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { items, isLoading, viewMode, filters, fetchItems, setViewMode, setFilters } = useClosetStore();
  const { colors, spacing, borderRadius } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = React.useState<ItemCategory | 'all'>('all');

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
          onPress={() => navigation.navigate(ROUTES.ITEM_DETAIL, { itemId: item.id })}
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
        onPress={() => navigation.navigate(ROUTES.ITEM_DETAIL, { itemId: item.id })}
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
          <AppText variant="display" style={{ fontWeight: '700' }}>My Closet</AppText>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              style={styles.headerButton}
            >
              <Text style={[styles.headerIcon, { color: colors.textPrimary }]}>
                {viewMode === 'grid' ? '☰' : '⊞'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.ADD_ITEM)}
              style={styles.headerButton}
            >
              <Text style={[styles.headerIcon, { color: colors.textPrimary }]}>+</Text>
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
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 3 : 1}
            contentContainerStyle={viewMode === 'grid' ? styles.gridList : styles.listList}
            key={viewMode}
            showsVerticalScrollIndicator={false}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingConstants.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacingConstants.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadiusConstants.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
  },
  listList: {
    paddingTop: spacingConstants.md,
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
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#F5F5F5',
  },
  listItemInfo: {
    flex: 1,
    marginLeft: spacingConstants.lg,
    justifyContent: 'center',
  },
});
