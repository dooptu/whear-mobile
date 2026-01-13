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

const verifySchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

type FormData = z.infer<typeof verifySchema>;
type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;
type RoutePropType = RouteProp<AuthStackParamList, typeof ROUTES.VERIFY_ACCOUNT>;

export const VerifyAccountScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { email } = route.params;
  const { showSnackbar } = useSnackbar();
  const { colors, spacing } = useAppTheme();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await authService.verifyAccount(email, data.code);
      showSnackbar('Account verified successfully!', 'success');
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
                <Text style={[styles.title, { color: colors.textPrimary }]}>Verify Your Account</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  We sent a verification code to {email}
                </Text>
                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                  Enter code: 123456
                </Text>
              </View>

              <AppCard variant="glass" style={styles.formCard}>
                <Controller
                  control={control}
                  name="code"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      label="Verification Code"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.code?.message}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  )}
                />

                <AppButton
                  label="Verify"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  style={styles.button}
                />

                <AppButton
                  label="Resend Code"
                  variant="ghost"
                  onPress={() => {}}
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
    marginBottom: spacingConstants.xs,
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
  button: {
    marginTop: spacingConstants.md,
  },
  linkButton: {
    marginTop: spacingConstants.sm,
  },
});

VerifyAccountScreen.displayName = 'VerifyAccountScreen';