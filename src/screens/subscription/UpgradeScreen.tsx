import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, AppButton, AppCard, LoadingSpinner, GradientBackground } from '../../components';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useEntitlementsStore } from '../../features/entitlementsStore';
import { useSnackbar } from '../../hooks/useSnackbar';
import { FREE_PLAN_LIMITS, PRO_PLAN_LIMITS } from '../../constants/limits';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const UpgradeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { entitlements, upgradeToPro, isLoading, fetchEntitlements } = useEntitlementsStore();
  const { showSnackbar } = useSnackbar();
  const { colors, spacing, borderRadius } = useAppTheme();

  useEffect(() => {
    if (user) {
      fetchEntitlements(user.id);
    }
  }, [user]);

  const handleUpgrade = async () => {
    if (!user) return;

    try {
      await upgradeToPro(user.id);
      showSnackbar('Upgraded to Pro successfully!', 'success');
      navigation.goBack();
    } catch (error) {
      showSnackbar((error as Error).message, 'error');
    }
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <LoadingSpinner />
      </GradientBackground>
    );
  }

  const isPro = entitlements?.plan === 'pro';

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <AppText variant="h1" style={{ fontWeight: '700' }}>Upgrade to Pro</AppText>
          {isPro && (
            <View style={[styles.proBadge, { backgroundColor: colors.accentLight, marginTop: spacing.sm }]}>
              <AppText variant="caption" color={colors.accent} style={{ fontWeight: '600' }}>
                ✓ You're already on Pro!
              </AppText>
            </View>
          )}
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.plans}>
            <AppCard variant="glass" style={[styles.planCard, { marginBottom: spacing.lg }]}>
              <AppText variant="h2" style={{ fontWeight: '700', marginBottom: spacing.sm }}>
                Free Plan
              </AppText>
              <AppText
                variant="display"
                style={{ fontWeight: '700', marginBottom: spacing.md, color: colors.textPrimary }}
              >
                $0
              </AppText>
              <View style={styles.features}>
                <AppText variant="body" color={colors.textSecondary} style={styles.feature}>
                  • Up to {FREE_PLAN_LIMITS.maxClosetItems} closet items
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.feature}>
                  • {FREE_PLAN_LIMITS.maxGeneratesPerDay} outfit generates per day
                </AppText>
              </View>
            </AppCard>

            <AppCard
              variant="floating"
              style={[
                styles.planCard,
                {
                  borderWidth: 2,
                  borderColor: colors.accent,
                  marginBottom: spacing.lg,
                },
              ]}
            >
              <AppText variant="h2" style={{ fontWeight: '700', marginBottom: spacing.sm }}>
                Pro Plan
              </AppText>
              <AppText
                variant="display"
                style={{ fontWeight: '700', marginBottom: spacing.md, color: colors.textPrimary }}
              >
                $9.99/mo
              </AppText>
              <View style={styles.features}>
                <AppText variant="body" color={colors.textSecondary} style={styles.feature}>
                  • Up to {PRO_PLAN_LIMITS.maxClosetItems} closet items
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.feature}>
                  • {PRO_PLAN_LIMITS.maxGeneratesPerDay} outfit generates per day
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.feature}>
                  • Priority support
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.feature}>
                  • Advanced AI features
                </AppText>
              </View>
              {!isPro && (
                <AppButton
                  label="Upgrade Now"
                  onPress={handleUpgrade}
                  loading={isLoading}
                  style={styles.upgradeButton}
                />
              )}
            </AppCard>
          </View>

          <AppText variant="caption" color={colors.textSecondary} style={styles.disclaimer}>
            * This is a demo. No actual payment will be processed.
          </AppText>
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
    marginBottom: spacingConstants.md,
  },
  proBadge: {
    paddingHorizontal: spacingConstants.md,
    paddingVertical: spacingConstants.sm,
    borderRadius: borderRadiusConstants.full,
    alignSelf: 'flex-start',
  },
  scrollContent: {
    paddingBottom: spacingConstants.xl,
  },
  plans: {
    marginTop: spacingConstants.lg,
  },
  planCard: {
    padding: spacingConstants.lg,
  },
  features: {
    marginTop: spacingConstants.md,
    gap: spacingConstants.sm,
  },
  feature: {
    marginBottom: spacingConstants.xs,
  },
  upgradeButton: {
    marginTop: spacingConstants.lg,
  },
  disclaimer: {
    marginTop: spacingConstants.xl,
    textAlign: 'center',
  },
});

UpgradeScreen.displayName = 'UpgradeScreen';