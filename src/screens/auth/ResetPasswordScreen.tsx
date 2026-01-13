import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppButton, AppInput, GradientBackground, AppCard } from '../../components';
import { ROUTES } from '../../constants/routes';
import { AuthStackParamList } from '../../navigation/types';
import { spacing as spacingConstants } from '../../constants/theme';
import { authService } from '../../services/authService';
import { useSnackbar } from '../../hooks/useSnackbar';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof resetPasswordSchema>;
type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;
type RoutePropType = RouteProp<AuthStackParamList, typeof ROUTES.RESET_PASSWORD>;

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { email, code } = route.params;
  const { showSnackbar } = useSnackbar();
  const { colors, spacing } = useAppTheme();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(email, code, data.password);
      showSnackbar('Password reset successfully!', 'success');
      navigation.navigate(ROUTES.LOGIN);
    } catch (error) {
      showSnackbar((error as Error).message, 'error');
    } finally {
      setIsLoading(false);
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
                <Text style={[styles.title, { color: colors.textPrimary }]}>Reset Password</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Enter your new password
                </Text>
              </View>

              <AppCard variant="glass" style={styles.formCard}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      label="New Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      secureTextEntry
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      label="Confirm New Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.confirmPassword?.message}
                      secureTextEntry
                    />
                  )}
                />

                <AppButton
                  label="Reset Password"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  style={styles.button}
                />
              </AppCard>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacingConstants.sm,
  },
  subtitle: {
    fontSize: 16,
  },
  formCard: {
    padding: spacingConstants.lg,
    marginBottom: spacingConstants.xl,
  },
  button: {
    marginTop: spacingConstants.md,
  },
});

ResetPasswordScreen.displayName = 'ResetPasswordScreen';
