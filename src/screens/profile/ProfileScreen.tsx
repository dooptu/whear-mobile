import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Icon = MaterialCommunityIcons;

import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, Avatar, LoadingSpinner, TagChip, GradientBackground, AppCard, BottomNavigationBar } from '../../components';
import { ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useClosetStore } from '../../features/closetStore';
import { useProfileStore } from '../../features/profileStore';
import { useThemeStore } from '../../features/themeStore';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { items } = useClosetStore();
  const { profile, isLoading, fetchProfile } = useProfileStore();
  const { colors, spacing, borderRadius, blur, isDark } = useAppTheme();
  const { themeMode, setThemeMode } = useThemeStore();
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user]);

  const handleThemeToggle = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('light');
    } else {
      // If auto, toggle to opposite of current system
      setThemeMode(isDark ? 'light' : 'dark');
    }
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <LoadingSpinner />
      </GradientBackground>
    );
  }

  const userItems = items.filter((item) => item.userId === user?.id);
  const itemCount = userItems.length;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <View style={{ width: 46 }} />
          <AppText variant="display" style={{ fontWeight: '700', color: colors.textPrimary }}>{user?.name || 'Profile'}</AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.SETTINGS)}
            style={[styles.headerButton, { borderColor: colors.glassBorder, borderRadius: borderRadius.full }]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView intensity={blur.medium} tint={isDark ? 'dark' : 'light'} style={styles.headerButtonInner}>
                <Icon name="cog-outline" size={22} color={colors.textPrimary} />
              </BlurView>
            ) : (
              <View style={[styles.headerButtonInner, { backgroundColor: colors.glassSurface }]}>
                <Icon name="cog-outline" size={22} color={colors.textPrimary} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
        >
          {/* Profile Header */}
          <View style={[styles.profileHeader, { paddingHorizontal: spacing.lg, paddingVertical: spacing.xl }]}>
            <Avatar name={user?.name} size={100} />
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <AppText variant="h1" style={{ fontWeight: '700' }}>{itemCount}</AppText>
                <AppText variant="caption" color={colors.textSecondary}>items</AppText>
              </View>
            </View>
          </View>

          {/* Theme Toggle Card */}
          <AppCard variant="glass" style={[styles.themeCard, { marginHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
            <View style={styles.themeCardContent}>
              <View style={styles.themeCardLeft}>
                <Icon name={isDark ? 'weather-night' : 'weather-sunny'} size={24} color={colors.accent} />
                <View style={styles.themeCardText}>
                  <AppText variant="body" style={{ fontWeight: '700', marginBottom: 2 }}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {themeMode === 'auto' ? 'Auto (System)' : themeMode === 'dark' ? 'Dark' : 'Light'}
                  </AppText>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleThemeToggle}
                style={[
                  styles.themeToggle,
                  {
                    backgroundColor: isDark ? colors.accent : colors.glassSurface,
                    borderColor: colors.glassBorder,
                  },
                ]}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.themeToggleThumb,
                    {
                      backgroundColor: isDark ? '#fff' : colors.accent,
                      transform: [{ translateX: isDark ? 20 : 0 }],
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </AppCard>

          {/* User Info Card */}
          <AppCard variant="glass" style={[styles.userInfoCard, { marginHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
            <AppText variant="h2" style={{ fontWeight: '700', marginBottom: spacing.sm }}>
              {user?.name || 'User'}
            </AppText>
            {user?.email && (
              <AppText variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
                {user.email}
              </AppText>
            )}
            
            {profile && (
              <>
                {(profile.gender || profile.height || profile.weight) && (
                  <View style={styles.bio}>
                    {profile.gender && (
                      <AppText variant="body" style={{ marginRight: spacing.md }}>
                        {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).replace('-', ' ')}
                      </AppText>
                    )}
                    {profile.height && (
                      <AppText variant="body" style={{ marginRight: spacing.md }}>
                        {profile.height} cm
                      </AppText>
                    )}
                    {profile.weight && (
                      <AppText variant="body">
                        {profile.weight} kg
                      </AppText>
                    )}
                  </View>
                )}

                {profile.stylePreferences && profile.stylePreferences.length > 0 && (
                  <View style={[styles.styleTags, { marginTop: spacing.md }]}>
                    {profile.stylePreferences.map((pref, index) => (
                      <TagChip
                        key={index}
                        label={pref}
                        selected={false}
                        style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}
                      />
                    ))}
                  </View>
                )}
              </>
            )}
          </AppCard>

          {/* Action Button */}
          <View style={[styles.actions, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
            <TouchableOpacity
              style={[
                styles.editButton,
                {
                  borderColor: colors.glassBorder,
                  backgroundColor: colors.glassSurface,
                  borderRadius: borderRadius.md,
                },
              ]}
              onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
              activeOpacity={0.8}
            >
              <AppText variant="body" style={{ fontWeight: '600' }}>Edit Profile</AppText>
            </TouchableOpacity>
          </View>

          {/* Closet Preview */}
          {itemCount > 0 && (
            <View style={[styles.closetPreview, { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }]}>
              <AppText variant="h2" style={{ fontWeight: '700', marginBottom: spacing.lg }}>
                Your Closet
              </AppText>
              <View style={styles.closetGrid}>
                {userItems.slice(0, 9).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.closetItem}
                    onPress={() => navigation.navigate(ROUTES.ITEM_DETAIL, { itemId: item.id })}
                    activeOpacity={0.9}
                  >
                    <Image
                      source={{ uri: item.imageUri }}
                      style={[styles.closetItemImage, { borderRadius: borderRadius.lg }]}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {itemCount > 9 && (
                <TouchableOpacity
                  style={[styles.viewAllButton, { marginTop: spacing.lg }]}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <AppText variant="body" color={colors.accent} style={{ fontWeight: '600' }}>
                    View All {itemCount} Items
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingConstants.xl * 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacingConstants.xl * 2,
  },
  statItem: {
    alignItems: 'center',
  },
  themeCard: {
    padding: spacingConstants.lg,
  },
  themeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingConstants.md,
  },
  themeCardText: {
    flex: 1,
  },
  themeToggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    padding: 2,
    justifyContent: 'center',
  },
  themeToggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  userInfoCard: {
    padding: spacingConstants.lg,
  },
  bio: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacingConstants.md,
  },
  styleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actions: {
    paddingBottom: spacingConstants.md,
  },
  editButton: {
    borderWidth: 1,
    paddingVertical: spacingConstants.md,
    alignItems: 'center',
  },
  closetPreview: {
    paddingBottom: spacingConstants.xl,
  },
  closetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingConstants.sm,
  },
  closetItem: {
    width: '31%',
    aspectRatio: 1,
  },
  closetItemImage: {
    width: '100%',
    height: '100%',
  },
  viewAllButton: {
    paddingVertical: spacingConstants.md,
    alignItems: 'center',
  },
});

ProfileScreen.displayName = 'ProfileScreen';
