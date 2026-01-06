import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppButton, AppText, GradientBackground } from '../../components';
import { ROUTES } from '../../constants/routes';
import { AuthStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing } = useAppTheme();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { padding: spacing.xl }]}>
          <View style={styles.logoContainer}>
            <AppText variant="display" style={[styles.logo, { color: colors.textPrimary }]}>
              Whear
            </AppText>
            <AppText variant="body" color={colors.textSecondary} style={styles.tagline}>
              Your personal style assistant
            </AppText>
          </View>

          <View style={styles.illustrationContainer}>
            <View style={[styles.illustration, { backgroundColor: `${colors.accent}20` }]} />
          </View>

          <View style={styles.actions}>
            <AppButton
              label="Get Started"
              onPress={() => navigation.navigate(ROUTES.REGISTER)}
              style={styles.button}
            />
            <AppButton
              label="Sign In"
              variant="glass"
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
              style={styles.button}
            />
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacingConstants.xxl,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: spacingConstants.sm,
  },
  tagline: {
    fontSize: 18,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: borderRadiusConstants.full,
  },
  actions: {
    gap: spacingConstants.md,
    marginBottom: spacingConstants.xl,
  },
  button: {
    marginVertical: spacingConstants.xs,
  },
});
