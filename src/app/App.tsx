import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
// Ensure expo-constants is loaded early to provide PlatformConstants
import 'expo-constants';
import { lightTheme, darkTheme } from '../constants/theme';
import { AuthStack } from '../navigation/AuthStack';
import { MainStack } from '../navigation/MainStack';
import { useAuthStore } from '../features/authStore';
import { useThemeStore } from '../features/themeStore';

const App: React.FC = () => {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const { themeMode } = useThemeStore();
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    checkAuth();
  }, []);

  const getTheme = () => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={getTheme()}>
          <NavigationContainer>
            <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
            {isAuthenticated ? <MainStack /> : <AuthStack />}
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

