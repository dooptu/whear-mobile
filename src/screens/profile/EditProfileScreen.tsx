import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppButton, AppInput, AppText, TagChip, GradientBackground, AppCard } from '../../components';
import { ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useProfileStore } from '../../features/profileStore';
import { useSnackbar } from '../../hooks/useSnackbar';

const editProfileSchema = z.object({
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']).optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  skinTone: z.string().optional(),
});

type FormData = z.infer<typeof editProfileSchema>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const styleOptions = ['casual', 'formal', 'minimalist', 'vintage', 'sporty', 'elegant', 'comfortable'];
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { profile, updateProfile, isLoading } = useProfileStore();
  const { showSnackbar } = useSnackbar();
  const { colors, spacing, borderRadius } = useAppTheme();
  const [selectedStyles, setSelectedStyles] = React.useState<string[]>([]);
  const [genderMenuVisible, setGenderMenuVisible] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      gender: profile?.gender,
      height: profile?.height?.toString(),
      weight: profile?.weight?.toString(),
      skinTone: profile?.skinTone,
    },
  });

  useEffect(() => {
    if (profile?.stylePreferences) {
      setSelectedStyles(profile.stylePreferences);
    }
  }, [profile]);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    try {
      await updateProfile(user.id, {
        gender: data.gender as any,
        height: data.height ? parseInt(data.height) : undefined,
        weight: data.weight ? parseFloat(data.weight) : undefined,
        skinTone: data.skinTone,
        stylePreferences: selectedStyles,
      });
      showSnackbar('Profile updated successfully', 'success');
      navigation.goBack();
    } catch (error) {
      showSnackbar((error as Error).message, 'error');
    }
  };

  const genderValue = genderOptions.find((g) => g.value === profile?.gender)?.label || 'Select gender';

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: colors.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <AppText variant="h1" style={{ fontWeight: '700' }}>Edit Profile</AppText>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
            showsVerticalScrollIndicator={false}
          >
            <AppCard variant="glass" style={styles.formCard}>
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <AppText variant="body" style={[styles.label, { marginBottom: spacing.sm, fontWeight: '600' }]}>
                      Gender
                    </AppText>
                    <TouchableOpacity
                      onPress={() => setGenderMenuVisible(true)}
                      style={[
                        styles.pickerButton,
                        {
                          backgroundColor: colors.glassSurface,
                          borderColor: colors.glassBorder,
                          borderRadius: borderRadius.sm,
                        },
                      ]}
                    >
                      <AppText variant="body" color={value ? colors.textPrimary : colors.textSecondary}>
                        {genderValue}
                      </AppText>
                      <Text style={[styles.dropdownIcon, { color: colors.textSecondary }]}>▼</Text>
                    </TouchableOpacity>
                    {genderMenuVisible && (
                      <AppCard variant="glass" style={styles.menu}>
                        {genderOptions.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            onPress={() => {
                              onChange(option.value as any);
                              setGenderMenuVisible(false);
                            }}
                            style={styles.menuItem}
                          >
                            <AppText variant="body">{option.label}</AppText>
                          </TouchableOpacity>
                        ))}
                      </AppCard>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="height"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Height (cm)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.height?.message}
                    keyboardType="number-pad"
                    containerStyle={{ marginTop: spacing.lg }}
                  />
                )}
              />

              <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Weight (kg)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.weight?.message}
                    keyboardType="decimal-pad"
                    containerStyle={{ marginTop: spacing.lg }}
                  />
                )}
              />

              <Controller
                control={control}
                name="skinTone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Skin Tone (optional)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.skinTone?.message}
                    containerStyle={{ marginTop: spacing.lg }}
                  />
                )}
              />

              <View style={[styles.section, { marginTop: spacing.xl }]}>
                <AppText variant="body" style={[styles.sectionTitle, { marginBottom: spacing.md, fontWeight: '600' }]}>
                  Style Preferences
                </AppText>
                <View style={styles.chips}>
                  {styleOptions.map((style) => (
                    <TagChip
                      key={style}
                      label={style}
                      selected={selectedStyles.includes(style)}
                      onPress={() => toggleStyle(style)}
                      style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}
                    />
                  ))}
                </View>
              </View>

              <AppButton
                label="Save Changes"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                style={styles.button}
              />
            </AppCard>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacingConstants.xl,
  },
  formCard: {
    padding: spacingConstants.lg,
  },
  label: {
    fontWeight: '600',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: spacingConstants.lg,
    borderWidth: 1,
  },
  dropdownIcon: {
    fontSize: 12,
  },
  menu: {
    marginTop: spacingConstants.xs,
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    padding: spacingConstants.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    marginBottom: spacingConstants.md,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    marginTop: spacingConstants.xl,
  },
});
