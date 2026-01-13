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
import { authService } from '../../services/authService';
import { useSnackbar } from '../../hooks/useSnackbar';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof forgotPasswordSchema>;
type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { showSnackbar } = useSnackbar();
  const { colors, spacing } = useAppTheme();
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const email = watch('email');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmailSent(true);
      showSnackbar('Reset code sent to your email', 'success');
    } catch (error) {
      showSnackbar((error as Error).message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={[styles.content, { padding: spacing.lg }]}>
            <AppCard variant="glass" style={styles.card}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Check Your Email</Text>
                <Text style={[styles.message, { color: colors.textSecondary }]}>
                  We sent a password reset code to {email}
                </Text>
                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                  Enter code: 123456
                </Text>
              </View>
              <AppButton
                label="Continue to Reset"
                onPress={() =>
                  navigation.navigate(ROUTES.RESET_PASSWORD, {
                    email: email || '',
                    code: '123456',
                  })
                }
                style={styles.button}
              />
            </AppCard>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

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
                <Text style={[styles.title, { color: colors.textPrimary }]}>Forgot Password?</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Enter your email to receive a reset code
                </Text>
              </View>

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
                    />
                  )}
                />

                <AppButton
                  label="Send Reset Code"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  style={styles.button}
                />

                <AppButton
                  label="Back to Sign In"
                  variant="ghost"
                  onPress={() => navigation.goBack()}
                  style={styles.linkButton}
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
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacingConstants.sm,
  },
  hint: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: spacingConstants.sm,
  },
  formCard: {
    padding: spacingConstants.lg,
    marginBottom: spacingConstants.xl,
  },
  card: {
    padding: spacingConstants.lg,
  },
  button: {
    marginTop: spacingConstants.md,
  },
  linkButton: {
    marginTop: spacingConstants.sm,
  },
});

ForgotPasswordScreen.displayName = 'ForgotPasswordScreen';