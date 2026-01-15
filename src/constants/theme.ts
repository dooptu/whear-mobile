import type { TextStyle } from 'react-native';
import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

export const brandColors = {
  // Light mode: White as primary background
  backgroundGradient: ['#FFFFFF', '#F8F9FA', '#FFFFFF'] as const,
  background: '#FFFFFF',
  surface: '#FFFFFF',
  cardBackground: '#FFFFFF',

  textPrimary: '#111827',
  textSecondary: '#6B7280',

  // overlays
  textOverlay: 'rgba(255,255,255,0.92)',
  textOverlayMuted: 'rgba(255,255,255,0.70)',

  // glass
  glassSurface: 'rgba(255,255,255,0.85)', // More opaque for better contrast
  glassBorder: 'rgba(0,0,0,0.1)',

  // accent
  accent: '#14B8A6', // Teal (stylist/AI vibe)
  accentLight: 'rgba(20, 184, 166, 0.15)',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const darkBrandColors = {
  // Dark mode: Black but not too dark
  backgroundGradient: ['#1A1A1A', '#1F1F1F', '#1A1A1A'] as const,
  background: '#1A1A1A',
  surface: '#1F1F1F',
  cardBackground: '#252525', // Slightly lighter than background for contrast

  textPrimary: '#E5E7EB',
  textSecondary: 'rgba(229,231,235,0.70)',

  textOverlay: 'rgba(255,255,255,0.92)',
  textOverlayMuted: 'rgba(255,255,255,0.70)',

  glassSurface: 'rgba(37,37,37,0.85)', // More opaque for better contrast
  glassBorder: 'rgba(255,255,255,0.15)',

  accent: '#14B8A6',
  accentLight: 'rgba(20, 184, 166, 0.15)',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const typography: Record<
  'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'tiny',
  TextStyle
> = {
  display: { 
    fontSize: 32, 
    lineHeight: 38, 
    fontWeight: '700',
    fontFamily: 'Cormorant_700Bold',
  },
  h1: { 
    fontSize: 22, 
    lineHeight: 28, 
    fontWeight: '700',
    fontFamily: 'Cormorant_700Bold',
  },
  h2: { 
    fontSize: 18, 
    lineHeight: 24, 
    fontWeight: '700',
    fontFamily: 'Cormorant_700Bold',
  },
  h3: { 
    fontSize: 16, 
    lineHeight: 22, 
    fontWeight: '700',
    fontFamily: 'Cormorant_700Bold',
  },
  body: { 
    fontSize: 16, 
    lineHeight: 22, 
    fontWeight: '500',
    fontFamily: 'Cormorant_500Medium',
  },
  caption: { 
    fontSize: 14, 
    lineHeight: 18, 
    fontWeight: '600',
    fontFamily: 'Cormorant_600SemiBold',
  },
  tiny: { 
    fontSize: 12, 
    lineHeight: 16, 
    fontWeight: '500',
    fontFamily: 'Cormorant_500Medium',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 28,
  full: 999,
};

export const shadows = {
  glassSoft: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  glassStrong: {
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
};

export const blur = {
  medium: 24,
  strong: 32,
};

// React Native Paper themes with custom font
const customFontConfig = {
  fontFamily: 'Cormorant_400Regular',
  fontWeight: '400' as const,
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: customFontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: brandColors.accent,
    secondary: brandColors.accent,
    error: brandColors.error,
    surface: '#FFFFFF',
    background: '#FFFFFF',
    onSurface: brandColors.textPrimary,
    onBackground: brandColors.textPrimary,
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: customFontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkBrandColors.accent,
    secondary: darkBrandColors.accent,
    error: darkBrandColors.error,
    surface: '#1E1E1E',
    background: '#0F1014',
    onSurface: darkBrandColors.textPrimary,
    onBackground: darkBrandColors.textPrimary,
  },
};
