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
  [ROUTES.OUTFIT_HISTORY]: undefined;
  [ROUTES.CATALOG]: { missingCategory?: string };
  [ROUTES.UPGRADE]: undefined;
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




