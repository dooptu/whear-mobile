import { create } from 'zustand';
import { Outfit, Occasion, WeatherContext, ClosetItem } from '../models';
import { outfitService } from '../services/outfitService';

interface OutfitState {
  generatedOutfits: Outfit[];
  history: Outfit[];
  isLoading: boolean;
  error: string | null;
  generateOutfits: (
    userId: string,
    occasion: Occasion,
    weather: WeatherContext,
    closetItems: ClosetItem[]
  ) => Promise<void>;
  saveToHistory: (outfitId: string) => Promise<void>;
  fetchHistory: (userId: string) => Promise<void>;
  replaceSlot: (
    outfitId: string,
    slot: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory',
    newItemId: string
  ) => Promise<void>;
  clearGenerated: () => void;
}

export const useOutfitStore = create<OutfitState>((set) => ({
  generatedOutfits: [],
  history: [],
  isLoading: false,
  error: null,
  generateOutfits: async (
    userId: string,
    occasion: Occasion,
    weather: WeatherContext,
    closetItems: ClosetItem[]
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await outfitService.generateOutfits(userId, occasion, weather, closetItems);
      set({ generatedOutfits: response.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  saveToHistory: async (outfitId: string) => {
    set({ isLoading: true, error: null });
    try {
      await outfitService.saveOutfitToHistory(outfitId);
      set((state) => ({
        history: state.history.map((outfit) =>
          outfit.id === outfitId ? { ...outfit, wornDate: new Date().toISOString().split('T')[0] } : outfit
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  fetchHistory: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await outfitService.getOutfitHistory(userId);
      set({ history: response.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  replaceSlot: async (
    outfitId: string,
    slot: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory',
    newItemId: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await outfitService.replaceOutfitSlot(outfitId, slot, newItemId);
      set((state) => ({
        generatedOutfits: state.generatedOutfits.map((outfit) =>
          outfit.id === outfitId ? response.data : outfit
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  clearGenerated: () => set({ generatedOutfits: [] }),
}));




