import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppButton, AppInput, GradientBackground, AppCard } from '../../components';
import { ROUTES } from '../../constants/routes';
import { AuthStackParamList } from '../../navigation/types';
import { spacing as spacingConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useSnackbar } from '../../hooks/useSnackbar';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof loginSchema>;
type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading } = useAuthStore();
  const { showSnackbar } = useSnackbar();
  const { colors, spacing } = useAppTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@whear.com',
      password: 'demo123',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      showSnackbar((error as Error).message, 'error');
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* Logo/Title */}
              <View style={styles.header}>
                <Text style={[styles.logo, { color: colors.textPrimary }]}>Whear</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Sign in to continue
                </Text>
              </View>

              {/* Form Card */}
              <AppCard variant="glass" style={styles.formCard}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      label="Email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      label="Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />

                <View style={styles.forgotContainer}>
                  <AppButton
                    label="Forgot password?"
                    variant="ghost"
                    onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
                    style={styles.forgotButton}
                  />
                </View>

                <AppButton
                  label="Log In"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  style={styles.loginButton}
                />
              </AppCard>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={[styles.signupText, { color: colors.textSecondary }]}>
                  Don't have an account?{' '}
                </Text>
                <AppButton
                  label="Sign Up"
                  variant="ghost"
                  onPress={() => navigation.navigate(ROUTES.REGISTER)}
                  style={styles.signupLink}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacingConstants.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacingConstants.xl * 2,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: spacingConstants.sm,
  },
  subtitle: {
    fontSize: 16,
  },
  formCard: {
    padding: spacingConstants.lg,
    marginBottom: spacingConstants.xl,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginTop: -spacingConstants.sm,
    marginBottom: spacingConstants.md,
  },
  forgotButton: {
    alignSelf: 'flex-end',
  },
  loginButton: {
    marginTop: spacingConstants.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacingConstants.xl,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    marginLeft: -spacingConstants.md,
  },
});

LoginScreen.displayName = 'LoginScreen';