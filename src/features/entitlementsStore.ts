import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entitlements } from '../models';
import { entitlementsService } from '../services/entitlementsService';

interface EntitlementsState {
  entitlements: Entitlements | null;
  isLoading: boolean;
  fetchEntitlements: (userId: string) => Promise<void>;
  upgradeToPro: (userId: string) => Promise<void>;
  checkClosetLimit: (userId: string, currentCount: number) => Promise<boolean>;
  checkGenerateLimit: (userId: string) => Promise<boolean>;
  incrementGenerateCount: (userId: string) => Promise<void>;
}

export const useEntitlementsStore = create<EntitlementsState>()(
  persist(
    (set, get) => ({
      entitlements: null,
      isLoading: false,
      fetchEntitlements: async (userId: string) => {
        set({ isLoading: true });
        try {
          const response = await entitlementsService.getEntitlements(userId);
          set({ entitlements: response.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
        }
      },
      upgradeToPro: async (userId: string) => {
        set({ isLoading: true });
        try {
          const response = await entitlementsService.upgradeToPro(userId);
          set({ entitlements: response.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      checkClosetLimit: async (userId: string, currentCount: number) => {
        return await entitlementsService.checkClosetLimit(userId, currentCount);
      },
      checkGenerateLimit: async (userId: string) => {
        return await entitlementsService.checkGenerateLimit(userId);
      },
      incrementGenerateCount: async (userId: string) => {
        await entitlementsService.incrementGenerateCount(userId);
        const entitlements = get().entitlements;
        if (entitlements) {
          entitlements.generatesToday += 1;
          set({ entitlements: { ...entitlements } });
        }
      },
    }),
    {
      name: 'entitlements-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);




