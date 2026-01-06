import { ClosetItem, APIResponse, ItemCategory } from '../models';
import { mockClosetItems } from '../data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ClosetService {
  async getClosetItems(userId: string): Promise<APIResponse<ClosetItem[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const items = mockClosetItems.filter((item) => item.userId === userId);
    return { data: items };
  }

  async getClosetItem(itemId: string): Promise<APIResponse<ClosetItem>> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const item = mockClosetItems.find((item) => item.id === itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    return { data: item };
  }

  async addClosetItem(
    userId: string,
    imageUri: string,
    category: ItemCategory,
    colors: string[],
    tags: string[],
    notes?: string
  ): Promise<APIResponse<ClosetItem>> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Simulate AI scan
    const aiConfidence = Math.random() * 0.2 + 0.8; // 0.8-1.0

    const newItem: ClosetItem = {
      id: `item-${Date.now()}`,
      userId,
      imageUri,
      category,
      colors,
      tags,
      notes,
      createdAt: new Date().toISOString(),
      aiConfidence,
    };

    mockClosetItems.push(newItem);
    return { data: newItem, message: 'Item added successfully' };
  }

  async updateClosetItem(
    itemId: string,
    updates: Partial<ClosetItem>
  ): Promise<APIResponse<ClosetItem>> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const item = mockClosetItems.find((item) => item.id === itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    Object.assign(item, updates);
    return { data: item, message: 'Item updated successfully' };
  }

  async deleteClosetItem(itemId: string): Promise<APIResponse<{ deleted: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockClosetItems.findIndex((item) => item.id === itemId);
    if (index === -1) {
      throw new Error('Item not found');
    }

    mockClosetItems.splice(index, 1);
    return { data: { deleted: true }, message: 'Item deleted successfully' };
  }

  async filterClosetItems(
    userId: string,
    filters: {
      category?: ItemCategory;
      color?: string;
      tag?: string;
    }
  ): Promise<APIResponse<ClosetItem[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let items = mockClosetItems.filter((item) => item.userId === userId);

    if (filters.category) {
      items = items.filter((item) => item.category === filters.category);
    }

    if (filters.color) {
      items = items.filter((item) => item.colors && item.colors.includes(filters.color!));
    }

    if (filters.tag) {
      items = items.filter((item) => item.tags && item.tags.includes(filters.tag!));
    }

    return { data: items };
  }
}

export const closetService = new ClosetService();

