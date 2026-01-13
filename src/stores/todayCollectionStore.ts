import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OutfitSuggestion } from '@/screens/home/HomeScreen';

type TodayCollectionState = {
  accepted: OutfitSuggestion[];
  rejected: OutfitSuggestion[];
  addAccepted: (outfit: OutfitSuggestion) => void;
  addRejected: (outfit: OutfitSuggestion) => void;
  removeAccepted: (id: string) => void;
  removeRejected: (id: string) => void;
  clearAll: () => void;
};

export const useTodayCollectionStore = create<TodayCollectionState>()(
  persist(
    (set, get) => ({
      accepted: [],
      rejected: [],
      addAccepted: (outfit) => {
        const cur = get().accepted;
        if (cur.some((x) => x.id === outfit.id)) return;
        set({ accepted: [outfit, ...cur] });
      },
      addRejected: (outfit) => {
        const cur = get().rejected;
        if (cur.some((x) => x.id === outfit.id)) return;
        set({ rejected: [outfit, ...cur] });
      },
      removeAccepted: (id) => {
        set({ accepted: get().accepted.filter((x) => x.id !== id) });
      },
      removeRejected: (id) => {
        set({ rejected: get().rejected.filter((x) => x.id !== id) });
      },
      clearAll: () => set({ accepted: [], rejected: [] }),
    }),
    {
      name: 'today-collection',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2, // Increment version for new rejected field
    }
  )
);
