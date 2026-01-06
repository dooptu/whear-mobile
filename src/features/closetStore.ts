import { create } from 'zustand';
import { ClosetItem, ItemCategory } from '../models';
import { closetService } from '../services/closetService';

interface ClosetState {
  items: ClosetItem[];
  isLoading: boolean;
  error: string | null;
  viewMode: 'list' | 'grid';
  filters: {
    category?: ItemCategory;
    color?: string;
    tag?: string;
  };
  fetchItems: (userId: string) => Promise<void>;
  addItem: (
    userId: string,
    imageUri: string,
    category: ItemCategory,
    colors: string[],
    tags: string[],
    notes?: string
  ) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<ClosetItem>) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  setViewMode: (mode: 'list' | 'grid') => void;
  setFilters: (filters: { category?: ItemCategory; color?: string; tag?: string }) => void;
  clearFilters: () => void;
}

export const useClosetStore = create<ClosetState>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  viewMode: 'grid',
  filters: {},
  fetchItems: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await closetService.getClosetItems(userId);
      set({ items: response.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  addItem: async (
    userId: string,
    imageUri: string,
    category: ItemCategory,
    colors: string[],
    tags: string[],
    notes?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await closetService.addClosetItem(userId, imageUri, category, colors, tags, notes);
      set((state) => ({ items: [...state.items, response.data], isLoading: false }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  updateItem: async (itemId: string, updates: Partial<ClosetItem>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await closetService.updateClosetItem(itemId, updates);
      set((state) => ({
        items: state.items.map((item) => (item.id === itemId ? response.data : item)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  deleteItem: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      await closetService.deleteClosetItem(itemId);
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  setViewMode: (mode: 'list' | 'grid') => set({ viewMode: mode }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));




