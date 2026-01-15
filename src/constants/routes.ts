export const ROUTES = {
  // Auth
  ONBOARDING: 'Onboarding',
  REGISTER: 'Register',
  LOGIN: 'Login',
  VERIFY_ACCOUNT: 'VerifyAccount',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',

  // Main
  MAIN_TABS: 'MainTabs',

  // Profile
  PROFILE: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  SETTINGS: 'Settings',

  // Closet
  CLOSET: 'Closet',
  ADD_ITEM: 'AddItem',
  ITEM_DETAIL: 'ItemDetail',

  // Outfit
  OUTFIT_GENERATOR: 'OutfitGenerator',
  OUTFIT_RESULTS: 'OutfitResults',
  OUTFIT_DETAIL: 'OutfitDetail',
  OUTFIT_HISTORY: 'OutfitHistory',
  COLLECTIONS: 'Collections',
  WEAR_TODAY: 'WearToday',

  // Catalog
  CATALOG: 'Catalog',

  // Subscription
  UPGRADE: 'Upgrade',

  // Social
  SOCIAL: 'Social',
} as const;

export const TAB_ROUTES = {
  HOME: 'HomeTab',
  CLOSET: 'ClosetTab',
  OUTFIT: 'OutfitTab',
  PROFILE: 'ProfileTab',
} as const;
