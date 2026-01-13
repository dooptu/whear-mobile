import { NavigatorScreenParams } from '@react-navigation/native';
import { ROUTES, TAB_ROUTES } from '../constants/routes';

export type AuthStackParamList = {
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.VERIFY_ACCOUNT]: { email: string };
  [ROUTES.FORGOT_PASSWORD]: undefined;
  [ROUTES.RESET_PASSWORD]: { email: string; code: string };
};

export type MainTabParamList = {
  [TAB_ROUTES.HOME]: undefined;
  [TAB_ROUTES.CLOSET]: undefined;
  [TAB_ROUTES.OUTFIT]: undefined;
  [TAB_ROUTES.PROFILE]: undefined;
};

export type MainStackParamList = {
  [ROUTES.MAIN_TABS]: NavigatorScreenParams<MainTabParamList>;
  [ROUTES.EDIT_PROFILE]: undefined;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.ADD_ITEM]: undefined;
  [ROUTES.ITEM_DETAIL]: { itemId: string };
  [ROUTES.OUTFIT_GENERATOR]: undefined;
  [ROUTES.OUTFIT_RESULTS]: undefined;
  [ROUTES.OUTFIT_DETAIL]: { outfitId: string };

  // UPDATED: optional params so Home can navigate safely without breaking the stack
  [ROUTES.OUTFIT_HISTORY]: { mode?: 'today' | 'all'; acceptedIds?: string[] } | undefined;

  [ROUTES.CATALOG]: { missingCategory?: string };
  [ROUTES.UPGRADE]: undefined;
  [ROUTES.COLLECTIONS]: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
