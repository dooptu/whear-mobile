import {
  User,
  Profile,
  ClosetItem,
  Outfit,
  CatalogItem,
  Entitlements,
} from '../models';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'demo@whear.com',
    name: 'Demo User',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockProfiles: Profile[] = [
  {
    userId: 'user-1',
    gender: 'female',
    height: 165,
    weight: 60,
    skinTone: 'medium',
    stylePreferences: ['casual', 'minimalist', 'comfortable'],
  },
];

export const mockClosetItems: ClosetItem[] = [
  {
    id: 'item-1',
    userId: 'user-1',
    imageUri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    category: 'top',
    colors: ['white', 'blue'],
    tags: ['casual', 'summer', 'cotton'],
    notes: 'Favorite summer shirt',
    createdAt: '2024-01-15T10:00:00Z',
    aiConfidence: 0.95,
  },
  {
    id: 'item-2',
    userId: 'user-1',
    imageUri: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400',
    category: 'bottom',
    colors: ['black', 'navy'],
    tags: ['formal', 'work', 'comfortable'],
    notes: 'Perfect for office',
    createdAt: '2024-01-16T10:00:00Z',
    aiConfidence: 0.92,
  },
  {
    id: 'item-3',
    userId: 'user-1',
    imageUri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'shoes',
    colors: ['white', 'black'],
    tags: ['sneakers', 'casual', 'sport'],
    notes: 'Daily wear sneakers',
    createdAt: '2024-01-17T10:00:00Z',
    aiConfidence: 0.88,
  },
  {
    id: 'item-4',
    userId: 'user-1',
    imageUri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    category: 'dress',
    colors: ['red', 'pink'],
    tags: ['party', 'elegant', 'summer'],
    notes: 'Great for events',
    createdAt: '2024-01-18T10:00:00Z',
    aiConfidence: 0.90,
  },
  {
    id: 'item-5',
    userId: 'user-1',
    imageUri: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400',
    category: 'outerwear',
    colors: ['beige', 'brown'],
    tags: ['winter', 'warm', 'casual'],
    notes: 'Cozy jacket',
    createdAt: '2024-01-19T10:00:00Z',
    aiConfidence: 0.93,
  },
];

export const mockOutfits: Outfit[] = [
  {
    id: 'outfit-1',
    userId: 'user-1',
    occasion: 'work',
    weather: { temperature: 22, isRaining: false },
    items: [
      { slot: 'top', itemId: 'item-1' },
      { slot: 'bottom', itemId: 'item-2' },
      { slot: 'shoes', itemId: 'item-3' },
    ],
    reason: 'Professional yet comfortable, perfect for office environment',
    createdAt: '2024-01-20T09:00:00Z',
    wornDate: '2024-01-20',
  },
];

export const mockCatalogItems: CatalogItem[] = [
  {
    id: 'catalog-1',
    name: 'Classic White Button Shirt',
    brand: 'Fashion Brand',
    price: 49.99,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    buyUrl: 'https://example.com/product/1',
    category: 'top',
    colors: ['white', 'blue'],
  },
  {
    id: 'catalog-2',
    name: 'Slim Fit Black Trousers',
    brand: 'Style Co',
    price: 79.99,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400',
    buyUrl: 'https://example.com/product/2',
    category: 'bottom',
    colors: ['black', 'navy'],
  },
];

export const mockEntitlements: Entitlements[] = [
  {
    userId: 'user-1',
    plan: 'free',
    closetItemCount: 5,
    generatesToday: 2,
    lastGenerateDate: new Date().toISOString().split('T')[0],
  },
];




