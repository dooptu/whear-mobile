import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, Avatar, LoadingSpinner, TagChip, GradientBackground, AppCard } from '../../components';
import { ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useClosetStore } from '../../features/closetStore';
import { useProfileStore } from '../../features/profileStore';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { items } = useClosetStore();
  const { profile, isLoading, fetchProfile } = useProfileStore();
  const { colors, spacing, borderRadius } = useAppTheme();

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user]);

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
          <AppText variant="display" style={{ fontWeight: '700' }}>{user?.name || 'Profile'}</AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.SETTINGS)}
            style={[styles.headerButton, { backgroundColor: colors.glassSurface }]}
          >
            <Text style={[styles.headerIcon, { color: colors.textPrimary }]}>⚙</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
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
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadiusConstants.full,
  },
  headerIcon: {
    fontSize: 24,
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
    backgroundColor: '#F5F5F5',
  },
  viewAllButton: {
    paddingVertical: spacingConstants.md,
    alignItems: 'center',
  },
});
