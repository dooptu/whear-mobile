import { apiClient } from '../utils/api';
import { Profile, APIResponse } from '../models';
import { mockProfiles } from '../data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileService {
  async getProfile(userId: string): Promise<APIResponse<Profile>> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const profile = mockProfiles.find((p) => p.userId === userId);
    if (!profile) {
      const newProfile: Profile = { userId };
      mockProfiles.push(newProfile);
      return { data: newProfile };
    }

    return { data: profile };
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<APIResponse<Profile>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let profile = mockProfiles.find((p) => p.userId === userId);
    if (!profile) {
      profile = { userId, ...updates };
      mockProfiles.push(profile);
    } else {
      Object.assign(profile, updates);
    }

    return { data: profile, message: 'Profile updated successfully' };
  }

  async deleteAccount(userId: string): Promise<APIResponse<{ deleted: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockProfiles.findIndex((p) => p.userId === userId);
    if (index !== -1) {
      mockProfiles.splice(index, 1);
    }

    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('userId');

    return { data: { deleted: true }, message: 'Account deleted successfully' };
  }
}

export const profileService = new ProfileService();




