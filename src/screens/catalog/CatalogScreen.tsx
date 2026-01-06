import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, AppCard, LoadingSpinner, EmptyState, GradientBackground } from '../../components';
import { MainStackParamList } from '../../navigation/types';
import { ROUTES } from '../../constants/routes';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { catalogService } from '../../services/catalogService';
import { CatalogItem } from '../../models';

type RoutePropType = RouteProp<MainStackParamList, typeof ROUTES.CATALOG>;

export const CatalogScreen: React.FC = () => {
  const route = useRoute<RoutePropType>();
  const { missingCategory } = route.params || {};
  const { colors, spacing, borderRadius } = useAppTheme();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCatalog();
  }, [missingCategory]);

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const response = await catalogService.getCatalogItems(missingCategory);
      setItems(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = async (item: CatalogItem) => {
    await catalogService.trackCatalogClick(item.id);
    Linking.openURL(item.buyUrl);
  };

  const renderItem = ({ item }: { item: CatalogItem }) => (
    <AppCard variant="floating" style={[styles.itemCard, { marginBottom: spacing.lg }]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={[styles.itemImage, { borderRadius: borderRadius.lg }]}
        resizeMode="cover"
      />
      <View style={[styles.itemInfo, { padding: spacing.lg }]}>
        <AppText variant="h2" style={{ fontWeight: '700', marginBottom: spacing.xs }}>
          {item.name}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.sm }}>
          {item.brand}
        </AppText>
        <AppText variant="h1" style={{ fontWeight: '700', marginBottom: spacing.md }}>
          {item.currency} {item.price.toFixed(2)}
        </AppText>
        <TouchableOpacity
          onPress={() => handleBuy(item)}
          style={[styles.buyButton, { backgroundColor: colors.accent, borderRadius: borderRadius.md }]}
          activeOpacity={0.8}
        >
          <AppText variant="body" style={[styles.buyButtonText, { color: '#FFFFFF' }]}>
            Buy Now
          </AppText>
        </TouchableOpacity>
      </View>
    </AppCard>
  );

  if (isLoading) {
    return (
      <GradientBackground>
        <LoadingSpinner />
      </GradientBackground>
    );
  }

  if (items.length === 0) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <EmptyState
            icon="shopping"
            title="No items available"
            message="Check back later for new items"
          />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <AppText variant="h1" style={{ fontWeight: '700' }}>Catalog</AppText>
          {missingCategory && (
            <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
              Suggested items for {missingCategory}
            </AppText>
          )}
        </View>

        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { padding: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacingConstants.md,
  },
  list: {
    paddingBottom: spacingConstants.xl,
  },
  itemCard: {
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F5F5F5',
  },
  itemInfo: {
    width: '100%',
  },
  buyButton: {
    paddingVertical: spacingConstants.md,
    alignItems: 'center',
  },
  buyButtonText: {
    fontWeight: '600',
  },
});
