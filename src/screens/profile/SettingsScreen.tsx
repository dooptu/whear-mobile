import React from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, AppButton, GradientBackground, AppCard } from '../../components';
import { ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useProfileStore } from '../../features/profileStore';
import { useThemeStore } from '../../features/themeStore';
import { useSnackbar } from '../../hooks/useSnackbar';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();
  const { deleteAccount } = useProfileStore();
  const { themeMode, setThemeMode } = useThemeStore();
  const { showSnackbar } = useSnackbar();
  const { colors, spacing, borderRadius } = useAppTheme();
  const [isDarkMode, setIsDarkMode] = React.useState(themeMode === 'dark');

  const handleThemeToggle = (value: boolean) => {
    setIsDarkMode(value);
    setThemeMode(value ? 'dark' : 'light');
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(user.id);
              await logout();
              showSnackbar('Account deleted successfully', 'success');
            } catch (error) {
              showSnackbar((error as Error).message, 'error');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const SettingItem: React.FC<{
    icon: string;
    title: string;
    onPress?: () => void;
    right?: React.ReactNode;
    destructive?: boolean;
  }> = ({ icon, title, onPress, right, destructive }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          backgroundColor: colors.glassSurface,
          borderColor: colors.glassBorder,
          borderRadius: borderRadius.lg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <AppText variant="body" color={destructive ? colors.error : colors.textPrimary}>
          {title}
        </AppText>
      </View>
      {right}
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: colors.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <AppText variant="h1" style={{ fontWeight: '700' }}>Settings</AppText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.content, { padding: spacing.lg }]}>
            <AppCard variant="glass" style={[styles.section, { marginBottom: spacing.lg }]}>
              <AppText variant="body" style={[styles.sectionTitle, { marginBottom: spacing.md, fontWeight: '600' }]}>
                Appearance
              </AppText>
              <SettingItem
                icon="🌓"
                title="Dark Mode"
                right={
                  <Switch
                    value={isDarkMode}
                    onValueChange={handleThemeToggle}
                    trackColor={{ false: colors.glassBorder, true: colors.accent }}
                    thumbColor="#FFFFFF"
                  />
                }
              />
            </AppCard>

            <AppCard variant="glass" style={[styles.section, { marginBottom: spacing.lg }]}>
              <AppText variant="body" style={[styles.sectionTitle, { marginBottom: spacing.md, fontWeight: '600' }]}>
                Account
              </AppText>
              <SettingItem icon="🔒" title="Privacy Policy" onPress={() => {}} />
              <SettingItem icon="📄" title="Terms of Service" onPress={() => {}} />
              <SettingItem icon="🗑️" title="Delete Account" onPress={handleDeleteAccount} destructive />
            </AppCard>

            <AppCard variant="glass" style={[styles.section, { marginBottom: spacing.lg }]}>
              <AppText variant="body" style={[styles.sectionTitle, { marginBottom: spacing.md, fontWeight: '600' }]}>
                About
              </AppText>
              <SettingItem icon="ℹ️" title="App Version" right={<AppText variant="caption" color={colors.textSecondary}>1.0.0</AppText>} />
              <SettingItem icon="⭐" title="Upgrade to Pro" onPress={() => navigation.navigate(ROUTES.UPGRADE)} />
            </AppCard>

            <AppButton
              label="Logout"
              variant="glass"
              onPress={handleLogout}
              style={styles.logoutButton}
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
  content: {
    paddingBottom: spacingConstants.xl,
  },
  section: {
    padding: spacingConstants.lg,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingConstants.md,
    paddingHorizontal: spacingConstants.md,
    borderWidth: 1,
    marginBottom: spacingConstants.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingConstants.md,
  },
  settingIcon: {
    fontSize: 20,
  },
  logoutButton: {
    marginTop: spacingConstants.xl,
  },
});

SettingsScreen.displayName = 'SettingsScreen';