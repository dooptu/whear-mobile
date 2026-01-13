import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, AppCard, LoadingSpinner, EmptyState, GradientBackground } from '../../components';
import { ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';
import { useOutfitStore } from '../../features/outfitStore';
import { formatDateFull } from '../../utils/date';
import { Outfit } from '../../models';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const OutfitHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { history, fetchHistory, isLoading } = useOutfitStore();
  const { colors, spacing, borderRadius } = useAppTheme();

  useEffect(() => {
    if (user) {
      fetchHistory(user.id);
    }
  }, [user]);

  const groupedHistory = history.reduce((acc, outfit) => {
    const date = outfit.wornDate || '';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(outfit);
    return acc;
  }, {} as Record<string, Outfit[]>);

  const renderGroup = ({ item: date }: { item: string }) => {
    const outfits = groupedHistory[date];
    return (
      <View style={[styles.group, { marginBottom: spacing.xl }]}>
        <AppText variant="h1" style={[styles.dateHeader, { marginBottom: spacing.md, fontWeight: '700' }]}>
          {formatDateFull(date)}
        </AppText>
        {outfits.map((outfit) => (
          <TouchableOpacity
            key={outfit.id}
            onPress={() => navigation.navigate(ROUTES.OUTFIT_DETAIL, { outfitId: outfit.id })}
            activeOpacity={0.8}
          >
            <AppCard variant="glass" style={[styles.outfitCard, { marginBottom: spacing.sm }]}>
              <AppText variant="body" style={{ fontWeight: '600', marginBottom: spacing.xs }}>
                {outfit.occasion.charAt(0).toUpperCase() + outfit.occasion.slice(1)}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {outfit.items?.length || 0} items • {outfit.weather?.temperature || 0}°C
              </AppText>
            </AppCard>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <LoadingSpinner />
      </GradientBackground>
    );
  }

  if (history.length === 0) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <EmptyState
            icon="calendar-clock"
            title="No outfit history"
            message="Wear some outfits to see them here"
          />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <AppText variant="h1" style={{ fontWeight: '700' }}>Outfit History</AppText>
        </View>

        <FlatList
          data={Object.keys(groupedHistory).sort((a, b) => b.localeCompare(a))}
          renderItem={renderGroup}
          keyExtractor={(date) => date}
          contentContainerStyle={[styles.list, { padding: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacingConstants.md,
  },
  list: {
    paddingBottom: spacingConstants.xl,
  },
  group: {
    marginBottom: spacingConstants.xl,
  },
  dateHeader: {
    fontWeight: '700',
  },
  outfitCard: {
    padding: spacingConstants.md,
  },
});

OutfitHistoryScreen.displayName = 'OutfitHistoryScreen';