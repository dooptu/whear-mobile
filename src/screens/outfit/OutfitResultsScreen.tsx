import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, AppCard, EmptyState, GradientBackground } from '../../components';
import { ROUTES } from '../../constants/routes';
import { MainStackParamList } from '../../navigation/types';
import { spacing as spacingConstants, borderRadius as borderRadiusConstants } from '../../constants/theme';
import { useOutfitStore } from '../../features/outfitStore';
import { Outfit } from '../../models';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const OutfitResultsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { generatedOutfits } = useOutfitStore();
  const { colors, spacing, borderRadius } = useAppTheme();

  const renderOutfit = ({ item }: { item: Outfit }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(ROUTES.OUTFIT_DETAIL, { outfitId: item.id })}
      activeOpacity={0.9}
    >
      <AppCard variant="floating" style={[styles.outfitCard, { marginBottom: spacing.lg }]}>
        <Image
          source={{ uri: item.items?.[0]?.item?.imageUri || '' }}
          style={[styles.outfitImage, { borderRadius: borderRadius.lg }]}
          resizeMode="cover"
        />
        <View style={styles.outfitOverlay}>
          <View style={styles.outfitContent}>
            <AppText variant="h1" overlay style={{ marginBottom: spacing.xs }}>
              {item.occasion.charAt(0).toUpperCase() + item.occasion.slice(1)}
            </AppText>
            <AppText variant="caption" overlay style={{ opacity: 0.9, marginBottom: spacing.sm }}>
              {item.weather?.temperature || 0}°C {item.weather?.isRaining ? '🌧️' : '☀️'}
            </AppText>
            <AppText variant="body" overlay style={{ opacity: 0.85 }}>
              {item.reason}
            </AppText>
          </View>
        </View>
      </AppCard>
    </TouchableOpacity>
  );

  if (generatedOutfits.length === 0) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <EmptyState
            icon="tshirt-crew"
            title="No outfits generated"
            message="Generate some outfits to see them here"
          />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <AppText variant="display" style={{ fontWeight: '700' }}>Outfit Suggestions</AppText>
        </View>

        <FlatList
          data={generatedOutfits}
          renderItem={renderOutfit}
          keyExtractor={(item) => item.id}
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
  outfitCard: {
    width: '100%',
    height: 350,
    overflow: 'hidden',
    padding: 0,
  },
  outfitImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  outfitOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  outfitContent: {
    padding: spacingConstants.lg,
  },
});

OutfitResultsScreen.displayName = 'OutfitResultsScreen';