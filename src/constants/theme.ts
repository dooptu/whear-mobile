import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Platform } from 'react-native';

// Fashion Editorial + Glassmorphism Design System
export const brandColors = {
  // Background gradients (pastel)
  backgroundGradient: ['#F0F4F8', '#E8EDF2', '#F5F0F8'], // misty blue / warm gray / subtle lavender
  background: '#F0F4F8', // Primary background
  
  // Glassmorphism surfaces
  glassSurface: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
  glassShadow: 'rgba(0, 0, 0, 0.1)',
  
  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textOverlay: 'rgba(255, 255, 255, 0.95)', // White text on images
  
  // Accent (soft teal)
  accent: '#14B8A6',
  accentLight: 'rgba(20, 184, 166, 0.15)',
  
  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Story/Collection rings
  storyRing: '#FF6B6B',
  storyRingActive: '#14B8A6',
};

export const darkBrandColors = {
  backgroundGradient: ['#1A1A2E', '#16213E', '#0F3460'],
  background: '#1A1A2E',
  glassSurface: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassShadow: 'rgba(0, 0, 0, 0.3)',
  textPrimary: '#FAFAFA',
  textSecondary: '#9CA3AF',
  textOverlay: 'rgba(255, 255, 255, 0.95)',
  accent: '#14B8A6',
  accentLight: 'rgba(20, 184, 166, 0.2)',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  storyRing: '#FF6B6B',
  storyRingActive: '#14B8A6',
};

// Spacing scale: 4 / 8 / 12 / 16 / 24 / 32
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Typography scale (Editorial + Modern)
export const typography = {
  display: { fontSize: 34, fontWeight: '700' as const, lineHeight: 42 }, // Large editorial headings
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  tiny: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};

// Border radius (larger, more rounded)
export const borderRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
};

// Glassmorphism shadows (soft, layered)
export const shadows = {
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  glassStrong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 12,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Glassmorphism blur (for iOS)
export const blur = {
  light: Platform.OS === 'ios' ? 20 : 0,
  medium: Platform.OS === 'ios' ? 30 : 0,
  strong: Platform.OS === 'ios' ? 40 : 0,
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandColors.accent,
    background: brandColors.background,
    surface: brandColors.glassSurface,
    text: brandColors.textPrimary,
    error: brandColors.error,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkBrandColors.accent,
    background: darkBrandColors.background,
    surface: darkBrandColors.glassSurface,
    text: darkBrandColors.textPrimary,
    error: darkBrandColors.error,
  },
};
