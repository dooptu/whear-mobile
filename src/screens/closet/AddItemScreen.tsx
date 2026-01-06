import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppButton, AppInput, AppText, TagChip, GradientBackground, AppCard } from '../../components';
import { ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useClosetStore } from '../../features/closetStore';
import { useEntitlementsStore } from '../../features/entitlementsStore';
import { useSnackbar } from '../../hooks/useSnackbar';
import { ItemCategory, colorNames } from '../../models';

const addItemSchema = z.object({
  category: z.enum(['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory', 'bag', 'other']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof addItemSchema>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const categories: ItemCategory[] = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory', 'bag', 'other'];
const commonTags = ['casual', 'formal', 'summer', 'winter', 'comfortable', 'elegant', 'sporty'];

export const AddItemScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { addItem, isLoading, items } = useClosetStore();
  const { checkClosetLimit } = useEntitlementsStore();
  const { showSnackbar } = useSnackbar();
  const { colors, spacing, borderRadius } = useAppTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [aiScanned, setAiScanned] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(addItemSchema),
  });

  const category = watch('category');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      simulateAIScan();
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      simulateAIScan();
    }
  };

  const simulateAIScan = () => {
    setTimeout(() => {
      const detectedCategory = categories[Math.floor(Math.random() * categories.length)];
      const detectedColors = colorNames.slice(0, Math.floor(Math.random() * 3) + 1);
      const detectedTags = commonTags.slice(0, Math.floor(Math.random() * 3) + 1);

      setValue('category', detectedCategory as ItemCategory);
      setSelectedColors(detectedColors);
      setSelectedTags(detectedTags);
      setAiScanned(true);
      showSnackbar('AI scan complete! Review and edit if needed.', 'success');
    }, 1000);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const onSubmit = async (data: FormData) => {
    if (!user || !imageUri) {
      showSnackbar('Please select an image', 'error');
      return;
    }

    if (selectedColors.length === 0) {
      showSnackbar('Please select at least one color', 'error');
      return;
    }

    try {
      const canAdd = await checkClosetLimit(user.id, items.length);
      if (!canAdd) {
        showSnackbar('Closet limit reached. Upgrade to Pro for more items.', 'error');
        navigation.navigate(ROUTES.UPGRADE);
        return;
      }

      await addItem(user.id, imageUri, data.category, selectedColors, selectedTags, data.notes);
      showSnackbar('Item added successfully!', 'success');
      navigation.goBack();
    } catch (error) {
      showSnackbar((error as Error).message, 'error');
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: colors.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <AppText variant="h1" style={{ fontWeight: '700' }}>Add Item</AppText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Section */}
          <AppCard variant="glass" style={[styles.imageCard, { marginBottom: spacing.xl }]}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={[styles.image, { borderRadius: borderRadius.lg }]}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: colors.glassBorder, borderRadius: borderRadius.lg }]}>
                <AppText variant="caption" color={colors.textSecondary}>No image selected</AppText>
              </View>
            )}
            <View style={styles.imageActions}>
              <AppButton
                label="Camera"
                variant="glass"
                onPress={takePhoto}
                style={styles.imageButton}
              />
              <AppButton
                label="Gallery"
                variant="glass"
                onPress={pickImage}
                style={styles.imageButton}
              />
            </View>
            {aiScanned && (
              <View style={[styles.aiChip, { backgroundColor: colors.accentLight, marginTop: spacing.md }]}>
                <Text style={[styles.aiText, { color: colors.accent }]}>✓ AI Scan Complete</Text>
              </View>
            )}
          </AppCard>

          {/* Form */}
          <AppCard variant="glass" style={styles.formCard}>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <View>
                  <AppText variant="body" style={[styles.label, { marginBottom: spacing.sm, fontWeight: '600' }]}>
                    Category
                  </AppText>
                  <TouchableOpacity
                    onPress={() => setCategoryMenuVisible(true)}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: colors.glassSurface,
                        borderColor: errors.category ? colors.error : colors.glassBorder,
                        borderRadius: borderRadius.sm,
                      },
                    ]}
                  >
                    <AppText variant="body" color={value ? colors.textPrimary : colors.textSecondary}>
                      {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Select category'}
                    </AppText>
                    <Text style={[styles.dropdownIcon, { color: colors.textSecondary }]}>▼</Text>
                  </TouchableOpacity>
                  {categoryMenuVisible && (
                    <AppCard variant="glass" style={styles.menu}>
                      {categories.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => {
                            onChange(cat);
                            setCategoryMenuVisible(false);
                          }}
                          style={styles.menuItem}
                        >
                          <AppText variant="body">{cat.charAt(0).toUpperCase() + cat.slice(1)}</AppText>
                        </TouchableOpacity>
                      ))}
                    </AppCard>
                  )}
                </View>
              )}
            />

            <View style={[styles.section, { marginTop: spacing.xl }]}>
              <AppText variant="body" style={[styles.sectionTitle, { marginBottom: spacing.md, fontWeight: '600' }]}>
                Colors
              </AppText>
              <View style={styles.chips}>
                {colorNames.map((color) => (
                  <TagChip
                    key={color}
                    label={color}
                    selected={selectedColors.includes(color)}
                    onPress={() => toggleColor(color)}
                    style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.section, { marginTop: spacing.lg }]}>
              <AppText variant="body" style={[styles.sectionTitle, { marginBottom: spacing.md, fontWeight: '600' }]}>
                Tags
              </AppText>
              <View style={styles.chips}>
                {commonTags.map((tag) => (
                  <TagChip
                    key={tag}
                    label={tag}
                    selected={selectedTags.includes(tag)}
                    onPress={() => toggleTag(tag)}
                    style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}
                  />
                ))}
              </View>
            </View>

            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Notes (optional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={3}
                  containerStyle={{ marginTop: spacing.lg }}
                />
              )}
            />

            <AppButton
              label="Save Item"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              style={styles.button}
            />
          </AppCard>
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
  scrollContent: {
    paddingBottom: spacingConstants.xl,
  },
  imageCard: {
    padding: spacingConstants.lg,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: spacingConstants.md,
    backgroundColor: '#F5F5F5',
  },
  imagePlaceholder: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingConstants.md,
  },
  imageActions: {
    flexDirection: 'row',
    gap: spacingConstants.md,
    width: '100%',
  },
  imageButton: {
    flex: 1,
  },
  aiChip: {
    paddingHorizontal: spacingConstants.md,
    paddingVertical: spacingConstants.sm,
    borderRadius: borderRadiusConstants.full,
  },
  aiText: {
    fontSize: 12,
    fontWeight: '500',
  },
  formCard: {
    padding: spacingConstants.lg,
  },
  label: {
    fontWeight: '600',
  },
  categoryButton: {
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
