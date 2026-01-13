import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OutfitSuggestion } from '@/screens/home/HomeScreen';

type TodayCollectionState = {
  accepted: OutfitSuggestion[];
  addAccepted: (outfit: OutfitSuggestion) => void;
  removeAccepted: (id: string) => void;
  clearAll: () => void;
};

export const useTodayCollectionStore = create<TodayCollectionState>()(
  persist(
    (set, get) => ({
      accepted: [],
      addAccepted: (outfit) => {
        const cur = get().accepted;
        if (cur.some((x) => x.id === outfit.id)) return;
        set({ accepted: [outfit, ...cur] });
      },
      removeAccepted: (id) => {
        set({ accepted: get().accepted.filter((x) => x.id !== id) });
      },
      clearAll: () => set({ accepted: [] }),
    }),
    {
      name: 'today-collection',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
