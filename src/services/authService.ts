import { apiClient } from '../utils/api';
import { User, AuthTokens, APIResponse } from '../models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../data/mockData';

class AuthService {
  async register(email: string, password: string, name: string): Promise<APIResponse<User>> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    const tokens: AuthTokens = {
      accessToken: `token-${Date.now()}`,
      refreshToken: `refresh-${Date.now()}`,
    };

    await AsyncStorage.setItem('accessToken', tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
    await AsyncStorage.setItem('userId', newUser.id);

    return { data: newUser, message: 'Registration successful' };
  }

  async login(email: string, password: string): Promise<APIResponse<User>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.email === email);
    if (!user || password !== 'demo123') {
      throw new Error('Invalid email or password');
    }

    const tokens: AuthTokens = {
      accessToken: `token-${Date.now()}`,
      refreshToken: `refresh-${Date.now()}`,
    };

    await AsyncStorage.setItem('accessToken', tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
    await AsyncStorage.setItem('userId', user.id);

    return { data: user, message: 'Login successful' };
  }

  async verifyAccount(email: string, code: string): Promise<APIResponse<{ verified: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (code !== '123456') {
      throw new Error('Invalid verification code');
    }

    return { data: { verified: true }, message: 'Account verified' };
  }

  async forgotPassword(email: string): Promise<APIResponse<{ sent: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      throw new Error('Email not found');
    }

    return { data: { sent: true }, message: 'Password reset email sent' };
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<APIResponse<{ reset: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (code !== '123456') {
      throw new Error('Invalid reset code');
    }

    return { data: { reset: true }, message: 'Password reset successful' };
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('userId');
  }

  async getCurrentUser(): Promise<User | null> {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return null;

    return mockUsers.find((u) => u.id === userId) || null;
  }
}

export const authService = new AuthService();




