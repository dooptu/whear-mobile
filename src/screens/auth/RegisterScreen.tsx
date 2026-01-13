import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
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

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof registerSchema>;
type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register: registerUser, isLoading } = useAuthStore();
  const { showSnackbar } = useSnackbar();
  const { colors, spacing } = useAppTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.email, data.password, data.name);
      navigation.navigate(ROUTES.VERIFY_ACCOUNT, { email: data.email });
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
              <View style={styles.header}>
                <Text style={[styles.logo, { color: colors.textPrimary }]}>Whear</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Create your account
                </Text>
              </View>

              <AppCard variant="glass" style={styles.formCard}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      label="Full Name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.name?.message}
                      autoCapitalize="words"
                    />
                  )}
                />

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

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      label="Confirm Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.confirmPassword?.message}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />

                <AppButton
                  label="Sign Up"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  style={styles.registerButton}
                />
              </AppCard>

              <View style={styles.loginContainer}>
                <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                  Already have an account?{' '}
                </Text>
                <AppButton
                  label="Sign In"
                  variant="ghost"
                  onPress={() => navigation.navigate(ROUTES.LOGIN)}
                  style={styles.loginLink}
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
  registerButton: {
    marginTop: spacingConstants.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacingConstants.xl,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    marginLeft: -spacingConstants.md,
  },
});

RegisterScreen.displayName = 'RegisterScreen';