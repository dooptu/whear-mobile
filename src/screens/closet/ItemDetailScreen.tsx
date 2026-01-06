import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, LoadingSpinner, TagChip, GradientBackground, AppCard } from '../../components';
import { ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useClosetStore } from '../../features/closetStore';
import { useSnackbar } from '../../hooks/useSnackbar';
import { ClosetItem } from '../../models';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type RoutePropType = RouteProp<MainStackParamList, typeof ROUTES.ITEM_DETAIL>;

export const ItemDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { itemId } = route.params;
  const { items, deleteItem, isLoading } = useClosetStore();
  const { showSnackbar } = useSnackbar();
  const { colors, spacing, borderRadius } = useAppTheme();
  const [item, setItem] = useState<ClosetItem | null>(null);

  useEffect(() => {
    const foundItem = items.find((i) => i.id === itemId);
    setItem(foundItem || null);
  }, [itemId, items]);

  const handleDelete = () => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteItem(itemId);
            showSnackbar('Item deleted successfully', 'success');
            navigation.goBack();
          } catch (error) {
            showSnackbar((error as Error).message, 'error');
          }
        },
      },
    ]);
  };

  if (isLoading || !item) {
    return (
      <GradientBackground>
        <LoadingSpinner />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: colors.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => {}} style={styles.headerButton}>
              <Text style={[styles.headerIcon, { color: colors.textPrimary }]}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Text style={[styles.headerIcon, { color: colors.error }]}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Full-bleed Image */}
          <Image
            source={{ uri: item.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Content Card */}
          <AppCard variant="glass" style={[styles.contentCard, { margin: spacing.lg }]}>
            <AppText variant="h1" style={{ fontWeight: '700', marginBottom: spacing.sm }}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </AppText>

            {item.aiConfidence && (
              <View style={[styles.confidenceChip, { backgroundColor: colors.accentLight, marginTop: spacing.sm }]}>
                <Text style={[styles.confidenceText, { color: colors.accent }]}>
                  🤖 AI Confidence: {Math.round(item.aiConfidence * 100)}%
                </Text>
              </View>
            )}

            {item.colors && item.colors.length > 0 && (
              <View style={[styles.section, { marginTop: spacing.xl }]}>
                <AppText variant="body" style={[styles.sectionTitle, { marginBottom: spacing.md, fontWeight: '600' }]}>
                  Colors
                </AppText>
                <View style={styles.chips}>
                  {item.colors.map((color, index) => (
                    <TagChip
                      key={index}
                      label={color}
                      selected={false}
                      style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}
                    />
                  ))}
                </View>
              </View>
            )}

            {item.tags && item.tags.length > 0 && (
              <View style={[styles.section, { marginTop: spacing.lg }]}>
                <AppText variant="body" style={[styles.sectionTitle, { marginBottom: spacing.md, fontWeight: '600' }]}>
                  Tags
                </AppText>
                <View style={styles.chips}>
                  {item.tags.map((tag, index) => (
                    <TagChip
                      key={index}
                      label={tag}
                      selected={false}
                      style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}
                    />
                  ))}
                </View>
              </View>
            )}

            {item.notes && (
              <View style={[styles.section, { marginTop: spacing.lg }]}>
                <AppText variant="body" style={[styles.sectionTitle, { marginBottom: spacing.sm, fontWeight: '600' }]}>
                  Notes
                </AppText>
                <AppText variant="body" color={colors.textSecondary}>{item.notes}</AppText>
              </View>
            )}

            <AppText variant="caption" color={colors.textSecondary} style={styles.date}>
              Added {new Date(item.createdAt).toLocaleDateString()}
            </AppText>
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
  headerActions: {
    flexDirection: 'row',
    gap: spacingConstants.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadiusConstants.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerIcon: {
    fontSize: 20,
  },
  image: {
    width: '100%',
    height: 500,
    backgroundColor: '#F5F5F5',
  },
  contentCard: {
    padding: spacingConstants.lg,
  },
  confidenceChip: {
    paddingHorizontal: spacingConstants.md,
    paddingVertical: spacingConstants.sm,
    borderRadius: borderRadiusConstants.full,
    alignSelf: 'flex-start',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
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
  date: {
    marginTop: spacingConstants.xl,
  },
});
