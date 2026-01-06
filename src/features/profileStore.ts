import { create } from 'zustand';
import { Profile } from '../models';
import { profileService } from '../services/profileService';

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Profile>) => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileService.getProfile(userId);
      set({ profile: response.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileService.updateProfile(userId, updates);
      set({ profile: response.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  deleteAccount: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await profileService.deleteAccount(userId);
      set({ profile: null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));




