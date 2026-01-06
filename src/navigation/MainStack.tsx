import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import { MainStackParamList } from './types';
import { MainTabs } from './MainTabs';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { AddItemScreen } from '../screens/closet/AddItemScreen';
import { ItemDetailScreen } from '../screens/closet/ItemDetailScreen';
import { OutfitResultsScreen } from '../screens/outfit/OutfitResultsScreen';
import { OutfitDetailScreen } from '../screens/outfit/OutfitDetailScreen';
import { OutfitHistoryScreen } from '../screens/outfit/OutfitHistoryScreen';
import { CatalogScreen } from '../screens/catalog/CatalogScreen';
import { UpgradeScreen } from '../screens/subscription/UpgradeScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabs} />
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
      <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
      <Stack.Screen name={ROUTES.ADD_ITEM} component={AddItemScreen} />
      <Stack.Screen name={ROUTES.ITEM_DETAIL} component={ItemDetailScreen} />
      <Stack.Screen name={ROUTES.OUTFIT_RESULTS} component={OutfitResultsScreen} />
      <Stack.Screen name={ROUTES.OUTFIT_DETAIL} component={OutfitDetailScreen} />
      <Stack.Screen name={ROUTES.OUTFIT_HISTORY} component={OutfitHistoryScreen} />
      <Stack.Screen name={ROUTES.CATALOG} component={CatalogScreen} />
      <Stack.Screen name={ROUTES.UPGRADE} component={UpgradeScreen} />
    </Stack.Navigator>
  );
};




