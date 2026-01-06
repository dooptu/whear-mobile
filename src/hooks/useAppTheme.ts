import { useColorScheme } from 'react-native';
import { useThemeStore } from '../features/themeStore';
import { brandColors, darkBrandColors, typography, spacing, borderRadius, shadows, blur } from '../constants/theme';

export const useAppTheme = () => {
  const { themeMode } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const isDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');
  const colors = isDark ? darkBrandColors : brandColors;

  return {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    blur,
    isDark,
  };
};
