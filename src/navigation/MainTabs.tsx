import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../hooks/useAppTheme';
import { TAB_ROUTES } from '../constants/routes';
import { MainTabParamList } from './types';
import { WearTodayScreen } from '../screens/home/WearTodayScreen';
import { ClosetScreen } from '../screens/closet/ClosetScreen';
import { OutfitGeneratorScreen } from '../screens/outfit/OutfitGeneratorScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  const { colors, borderRadius, blur: blurAmount } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 60,
          borderRadius: borderRadius.full,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.glassSurface,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.glassBorder,
          paddingBottom: 8,
          paddingTop: 8,
          ...(Platform.OS === 'ios' ? {} : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 8,
          }),
        },
        tabBarBackground: () => {
          if (Platform.OS === 'ios') {
            return (
              <BlurView
                intensity={blurAmount.strong}
                style={StyleSheet.absoluteFill}
              />
            );
          }
          return null;
        },
      }}
    >
      <Tab.Screen
        name={TAB_ROUTES.HOME}
        component={WearTodayScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            if (!Icon) return null;
            return <Icon name="home" size={size || 24} color={color} />;
          },
          tabBarLabel: 'Today',
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.CLOSET}
        component={ClosetScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            if (!Icon) return null;
            return <Icon name="hanger" size={size || 24} color={color} />;
          },
          tabBarLabel: 'Closet',
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.OUTFIT}
        component={OutfitGeneratorScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            if (!Icon) return null;
            return <Icon name="tshirt-crew" size={size || 24} color={color} />;
          },
          tabBarLabel: 'Outfit',
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            if (!Icon) return null;
            return <Icon name="account" size={size || 24} color={color} />;
          },
          tabBarLabel: 'Profile',
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
};

MainTabs.displayName = 'MainTabs';

export { MainTabs };
