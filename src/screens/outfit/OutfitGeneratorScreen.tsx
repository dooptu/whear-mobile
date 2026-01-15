import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Switch, Image, TouchableOpacity, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppButton, AppText, AppCard, TagChip, GradientBackground, StoryChip, Avatar, BottomNavigationBar } from '../../components';
import { ROUTES, TAB_ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useClosetStore } from '../../features/closetStore';
import { useOutfitStore } from '../../features/outfitStore';
import { useEntitlementsStore } from '../../features/entitlementsStore';
import { useSnackbar } from '../../hooks/useSnackbar';
import { Occasion, WeatherContext } from '../../models';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';

type NavigationProp = BottomTabNavigationProp<MainTabParamList>;

const occasions: Occasion[] = ['work', 'casual', 'date', 'party', 'sport'];

export const OutfitGeneratorScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { items } = useClosetStore();
  const { generateOutfits, isLoading, generatedOutfits, history } = useOutfitStore();
  const { checkGenerateLimit, incrementGenerateCount } = useEntitlementsStore();
  const { showSnackbar } = useSnackbar();
  const { colors, spacing, borderRadius, blur, isDark } = useAppTheme();

  const [occasion, setOccasion] = useState<Occasion>('casual');
  const [temperature, setTemperature] = useState<string>('22');
  const [isRaining, setIsRaining] = useState(false);
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const simulatedTemp = Math.floor(Math.random() * 20) + 15;
        setTemperature(simulatedTemp.toString());
        setLocationLoaded(true);
      }
    } catch (error) {
      setLocationLoaded(false);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;

    try {
      const canGenerate = await checkGenerateLimit(user.id);
      if (!canGenerate) {
        showSnackbar('Daily generate limit reached. Upgrade to Pro for more.', 'error');
        navigation.navigate(ROUTES.UPGRADE);
        return;
      }

      if (items.length < 3) {
        showSnackbar('Add at least 3 items to your closet first', 'error');
        return;
      }

      const weather: WeatherContext = {
        temperature: parseInt(temperature) || 22,
        isRaining,
      };

      await generateOutfits(user.id, occasion, weather, items);
      await incrementGenerateCount(user.id);
      const parent = navigation.getParent();
      if (parent) {
        (parent as any).navigate(ROUTES.OUTFIT_RESULTS);
      }
    } catch (error) {
      showSnackbar((error as Error).message, 'error');
    }
  };

  // Get today's outfit if available (from history or generated)
  const todayOutfit = history.length > 0 ? history[0] : (generatedOutfits.length > 0 ? generatedOutfits[0] : null);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Animated.ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.lg }]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ width: 46 }} />
            <AppText variant="display" style={{ fontWeight: '700', color: colors.textPrimary }}>
              Today
            </AppText>
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

          {/* Hero Card - Today's Outfit */}
          {todayOutfit ? (
            <AppCard variant="floating" style={StyleSheet.flatten([styles.heroCard, { marginTop: spacing.xl }])}>
              <Image
                source={{ uri: todayOutfit.items?.[0]?.item?.imageUri || '' }}
                style={[styles.heroImage, { borderRadius: borderRadius.lg }]}
                resizeMode="cover"
              />
              <View style={styles.heroOverlay}>
                <View style={styles.heroContent}>
                  <AppText variant="h1" overlay style={{ marginBottom: spacing.sm }}>
                    {todayOutfit.occasion.charAt(0).toUpperCase() + todayOutfit.occasion.slice(1)} Outfit
                  </AppText>
                  <AppText variant="body" overlay style={{ opacity: 0.9 }}>
                    {todayOutfit.reason}
                  </AppText>
                  <View style={styles.heroActions}>
                    <AppButton
                      label="Wear Today"
                      variant="glass"
                      onPress={() => {
                        const parent = navigation.getParent();
                        if (parent) {
                          (parent as any).navigate(ROUTES.OUTFIT_DETAIL, { outfitId: todayOutfit.id });
                        }
                      }}
                      style={styles.heroButton}
                    />
                  </View>
                </View>
              </View>
            </AppCard>
          ) : (
            <AppCard variant="floating" style={StyleSheet.flatten([styles.heroCard, { marginTop: spacing.xl }])}>
              <View style={[styles.heroPlaceholder, { backgroundColor: colors.glassSurface }]}>
                <AppText variant="h2" color={colors.textSecondary}>
                  Generate your first outfit
                </AppText>
              </View>
            </AppCard>
          )}

          {/* Story-style Collection Chips */}
          <View style={[styles.collectionsRow, { marginTop: spacing.xl }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.collectionsContent}>
              {occasions.map((occ, index) => (
                <StoryChip
                  key={occ}
                  label={occ}
                  active={occasion === occ}
                  onPress={() => setOccasion(occ)}
                  size={64}
                />
              ))}
            </ScrollView>
          </View>

          {/* Generate Section */}
          <View style={[styles.generateSection, { marginTop: spacing.xl }]}>
            <AppText variant="h2" style={{ fontWeight: '700', marginBottom: spacing.lg }}>
              Generate New Outfit
            </AppText>

            <AppCard variant="glass" style={styles.weatherCard}>
              <AppText variant="body" style={[styles.label, { marginBottom: spacing.md }]}>
                Weather Context
              </AppText>

              <View style={styles.inputRow}>
                <AppText variant="caption" color={colors.textSecondary}>Temperature</AppText>
                <View style={[styles.tempInput, { backgroundColor: colors.glassSurface, borderColor: colors.glassBorder }]}>
                  <Text style={[styles.tempText, { color: colors.textPrimary }]}>
                    {temperature}°C
                  </Text>
                </View>
              </View>

              <View style={[styles.switchRow, { borderTopColor: colors.glassBorder, borderBottomColor: colors.glassBorder }]}>
                <AppText variant="body">Is it raining?</AppText>
                <Switch
                  value={isRaining}
                  onValueChange={setIsRaining}
                  trackColor={{ false: colors.glassBorder, true: colors.accent }}
                  thumbColor={colors.textPrimary}
                />
              </View>

              {locationLoaded && (
                <View style={[styles.locationChip, { backgroundColor: colors.accentLight, marginTop: spacing.md }]}>
                  <Text style={[styles.locationText, { color: colors.accent }]}>📍 Location loaded</Text>
                </View>
              )}
            </AppCard>

            <AppButton
              label="Generate Outfits"
              variant="primary"
              onPress={handleGenerate}
              loading={isLoading}
              style={styles.generateButton}
            />
          </View>
        </Animated.ScrollView>

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
  scrollContent: {
    paddingVertical: spacingConstants.xl,
    paddingBottom: 100, // Extra padding for bottom navigation bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingConstants.md,
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
  hotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingConstants.md,
    paddingVertical: spacingConstants.sm,
    borderRadius: borderRadiusConstants.full,
    borderWidth: 1,
    gap: spacingConstants.xs,
  },
  hotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  flameIcon: {
    fontSize: 12,
  },
  heroCard: {
    width: '100%',
    height: 400,
    overflow: 'hidden',
    padding: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: spacingConstants.lg,
  },
  heroActions: {
    marginTop: spacingConstants.md,
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  heroPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadiusConstants.lg,
  },
  collectionsRow: {
    marginBottom: spacingConstants.md,
  },
  collectionsContent: {
    paddingRight: spacingConstants.lg,
  },
  generateSection: {
    marginBottom: spacingConstants.xl,
  },
  label: {
    fontWeight: '600',
  },
  weatherCard: {
    marginBottom: spacingConstants.lg,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingConstants.md,
  },
  tempInput: {
    paddingHorizontal: spacingConstants.md,
    paddingVertical: spacingConstants.sm,
    borderRadius: borderRadiusConstants.sm,
    borderWidth: 1,
  },
  tempText: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingConstants.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  locationChip: {
    paddingHorizontal: spacingConstants.md,
    paddingVertical: spacingConstants.sm,
    borderRadius: borderRadiusConstants.full,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  generateButton: {
    marginTop: spacingConstants.md,
  },
});

OutfitGeneratorScreen.displayName = 'OutfitGeneratorScreen';