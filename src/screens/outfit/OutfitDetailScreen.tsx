import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, AppButton, AppCard, LoadingSpinner, GradientBackground } from '../../components';
import { ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useOutfitStore } from '../../features/outfitStore';
import { useClosetStore } from '../../features/closetStore';
import { useSnackbar } from '../../hooks/useSnackbar';
import { outfitService } from '../../services/outfitService';
import { Outfit, ClosetItem } from '../../models';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RoutePropType = RouteProp<MainStackParamList, typeof ROUTES.OUTFIT_DETAIL>;

export const OutfitDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { outfitId } = route.params;
  const { saveToHistory, replaceSlot, isLoading } = useOutfitStore();
  const { items } = useClosetStore();
  const { showSnackbar } = useSnackbar();
  const { colors, spacing, borderRadius } = useAppTheme();
  const [outfit, setOutfit] = useState<Outfit | null>(null);

  useEffect(() => {
    loadOutfit();
  }, [outfitId]);

  const loadOutfit = async () => {
    try {
      const response = await outfitService.getOutfit(outfitId);
      setOutfit(response.data);
    } catch (error) {
      showSnackbar((error as Error).message, 'error');
    }
  };

  const handleWearToday = async () => {
    if (!outfit) return;

    const canWear = outfitService.canWearOutfitAgain(outfit.id);
    if (!canWear) {
      showSnackbar('You wore this outfit recently. Try again in a few days!', 'error');
      return;
    }

    try {
      await saveToHistory(outfit.id);
      showSnackbar('Outfit saved to history!', 'success');
      navigation.goBack();
    } catch (error) {
      showSnackbar((error as Error).message, 'error');
    }
  };

  if (isLoading || !outfit) {
    return (
      <GradientBackground>
        <LoadingSpinner />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: colors.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <AppText variant="h1" style={{ fontWeight: '700' }}>
            {outfit.occasion.charAt(0).toUpperCase() + outfit.occasion.slice(1)}
          </AppText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          {outfit.items && outfit.items[0]?.item && (
            <View style={[styles.heroSection, { paddingHorizontal: spacing.lg, marginTop: spacing.lg }]}>
              <Image
                source={{ uri: outfit.items[0].item.imageUri }}
                style={[styles.heroImage, { borderRadius: borderRadius.xl }]}
                resizeMode="cover"
              />
              <View style={[styles.heroOverlay, { borderRadius: borderRadius.xl }]}>
                <View style={styles.heroContent}>
                  <AppText variant="display" overlay style={{ marginBottom: spacing.sm }}>
                    {outfit.occasion.charAt(0).toUpperCase() + outfit.occasion.slice(1)} Outfit
                  </AppText>
                  <AppText variant="body" overlay style={{ opacity: 0.9 }}>
                    {outfit.reason}
                  </AppText>
                </View>
              </View>
            </View>
          )}

          {/* Outfit Items Grid */}
          <View style={[styles.outfitGrid, { padding: spacing.lg, gap: spacing.md }]}>
            {outfit.items && outfit.items.map((slot, index) => {
              const item = slot.item;

              return (
                <AppCard key={index} variant="glass" style={styles.outfitItem}>
                  <AppText variant="body" style={{ fontWeight: '600', marginBottom: spacing.sm }}>
                    {slot.slot.charAt(0).toUpperCase() + slot.slot.slice(1)}
                  </AppText>
                  {item ? (
                    <Image
                      source={{ uri: item.imageUri }}
                      style={[styles.itemImage, { borderRadius: borderRadius.lg }]}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.itemPlaceholder, { backgroundColor: colors.glassBorder, borderRadius: borderRadius.lg }]}>
                      <AppText variant="caption" color={colors.textSecondary}>No item</AppText>
                    </View>
                  )}
                </AppCard>
              );
            })}
          </View>

          {/* Weather Info */}
          <View style={[styles.weatherInfo, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
            <AppCard variant="glass" style={styles.weatherCard}>
              <AppText variant="caption" color={colors.textSecondary}>
                Weather: {outfit.weather?.temperature || 0}°C{' '}
                {outfit.weather?.isRaining ? '🌧️ with rain' : '☀️ sunny'}
              </AppText>
            </AppCard>
          </View>

          {/* Actions */}
          <View style={[styles.actions, { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }]}>
            <AppButton
              label="Wear Today"
              onPress={handleWearToday}
              style={styles.wearButton}
            />
          </View>
        </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadiusConstants.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  placeholder: {
    width: 40,
  },
  heroSection: {
    marginBottom: spacingConstants.lg,
  },
  heroImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#F5F5F5',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: spacingConstants.lg,
    right: spacingConstants.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: spacingConstants.lg,
  },
  heroContent: {
    // Content styles
  },
  outfitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  outfitItem: {
    width: '48%',
    padding: spacingConstants.md,
  },
  itemImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5F5F5',
  },
  itemPlaceholder: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherInfo: {
    marginTop: spacingConstants.md,
  },
  weatherCard: {
    padding: spacingConstants.md,
  },
  actions: {
    marginTop: spacingConstants.md,
  },
  wearButton: {
    marginTop: spacingConstants.md,
  },
});

OutfitDetailScreen.displayName = 'OutfitDetailScreen';