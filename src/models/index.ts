export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Profile {
  userId: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  height?: number; // in cm
  weight?: number; // in kg
  skinTone?: string;
  stylePreferences?: string[];
}

export interface ClosetItem {
  id: string;
  userId: string;
  imageUri: string;
  category: ItemCategory;
  colors: string[];
  tags: string[];
  notes?: string;
  createdAt: string;
  aiConfidence?: number;
}

export type ItemCategory =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'shoes'
  | 'accessory'
  | 'bag'
  | 'other';

export interface Outfit {
  id: string;
  userId: string;
  occasion: Occasion;
  weather: WeatherContext;
  items: OutfitItemSlot[];
  reason: string;
  createdAt: string;
  wornDate?: string;
}

export type Occasion = 'work' | 'casual' | 'date' | 'party' | 'sport';

export interface WeatherContext {
  temperature: number; // Celsius
  isRaining: boolean;
}

export interface OutfitItemSlot {
  slot: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';
  itemId: string;
  item?: ClosetItem;
}

export interface CatalogItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  imageUrl: string;
  buyUrl: string;
  category: ItemCategory;
  colors: string[];
}

export interface Entitlements {
  userId: string;
  plan: 'free' | 'pro';
  closetItemCount: number;
  generatesToday: number;
  lastGenerateDate: string;
}

export interface APIResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}




