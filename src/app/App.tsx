import 'expo-constants';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { lightTheme, darkTheme } from '../constants/theme';
import { AuthStack } from '../navigation/AuthStack';
import { MainStack } from '../navigation/MainStack';
import { useAuthStore } from '../features/authStore';
import { useThemeStore } from '../features/themeStore';
import 'react-native-gesture-handler';


const App: React.FC = () => {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const { themeMode } = useThemeStore();
  const systemColorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure React Native runtime is ready
    const initApp = async () => {
      try {
        await checkAuth();
        // Small delay to ensure all modules are loaded
        setTimeout(() => {
          setIsReady(true);
        }, 100);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true); // Still allow app to render
      }
    };
    initApp();
  }, [checkAuth]);

  const getTheme = () => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };

  // Show loading while checking auth or runtime not ready
  if (isLoading || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
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

App.displayName = 'App';

export default App;

