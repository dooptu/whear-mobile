import { Outfit, ClosetItem, Occasion, WeatherContext, APIResponse } from '../models';
import { mockOutfits, mockClosetItems } from '../data/mockData';
import { formatDate } from '../utils/date';

class OutfitService {
  async generateOutfits(
    userId: string,
    occasion: Occasion,
    weather: WeatherContext,
    closetItems: ClosetItem[]
  ): Promise<APIResponse<Outfit[]>> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple outfit generation logic
    const outfits: Outfit[] = [];
    const reasons = [
      'Perfect combination for the occasion and weather',
      'Stylish and comfortable for all-day wear',
      'Balanced colors and textures create a cohesive look',
      'Versatile pieces that work well together',
      'On-trend while maintaining personal style',
    ];

    for (let i = 0; i < 3; i++) {
      const top = closetItems.find((item) => item.category === 'top');
      const bottom = closetItems.find((item) => item.category === 'bottom');
      const shoes = closetItems.find((item) => item.category === 'shoes');
      const outerwear = closetItems.find((item) => item.category === 'outerwear');
      const accessory = closetItems.find((item) => item.category === 'accessory');

      if (!top || !bottom || !shoes) {
        break; // Need at least top, bottom, shoes
      }

      const outfit: Outfit = {
        id: `outfit-${Date.now()}-${i}`,
        userId,
        occasion,
        weather,
        items: [
          { slot: 'top', itemId: top.id },
          { slot: 'bottom', itemId: bottom.id },
          { slot: 'shoes', itemId: shoes.id },
          ...(outerwear ? [{ slot: 'outerwear', itemId: outerwear.id }] : []),
          ...(accessory ? [{ slot: 'accessory', itemId: accessory.id }] : []),
        ],
        reason: reasons[i % reasons.length],
        createdAt: new Date().toISOString(),
      };

      outfits.push(outfit);
    }

    return { data: outfits };
  }

  async getOutfit(outfitId: string): Promise<APIResponse<Outfit>> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const outfit = mockOutfits.find((o) => o.id === outfitId);
    if (!outfit) {
      throw new Error('Outfit not found');
    }

    // Populate items
    outfit.items = outfit.items.map((slot) => {
      const item = mockClosetItems.find((i) => i.id === slot.itemId);
      return { ...slot, item };
    });

    return { data: outfit };
  }

  async saveOutfitToHistory(outfitId: string): Promise<APIResponse<Outfit>> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const outfit = mockOutfits.find((o) => o.id === outfitId);
    if (!outfit) {
      throw new Error('Outfit not found');
    }

    outfit.wornDate = new Date().toISOString().split('T')[0];
    return { data: outfit, message: 'Outfit saved to history' };
  }

  async getOutfitHistory(userId: string): Promise<APIResponse<Outfit[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const outfits = mockOutfits
      .filter((o) => o.userId === userId && o.wornDate)
      .sort((a, b) => {
        const dateA = a.wornDate || '';
        const dateB = b.wornDate || '';
        return dateB.localeCompare(dateA);
      });

    // Populate items
    outfits.forEach((outfit) => {
      outfit.items = outfit.items.map((slot) => {
        const item = mockClosetItems.find((i) => i.id === slot.itemId);
        return { ...slot, item };
      });
    });

    return { data: outfits };
  }

  async replaceOutfitSlot(
    outfitId: string,
    slot: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory',
    newItemId: string
  ): Promise<APIResponse<Outfit>> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const outfit = mockOutfits.find((o) => o.id === outfitId);
    if (!outfit) {
      throw new Error('Outfit not found');
    }

    const slotIndex = outfit.items.findIndex((item) => item.slot === slot);
    if (slotIndex !== -1) {
      outfit.items[slotIndex].itemId = newItemId;
    } else {
      outfit.items.push({ slot, itemId: newItemId });
    }

    return { data: outfit, message: 'Outfit updated' };
  }

  canWearOutfitAgain(outfitId: string, daysSince: number = 7): boolean {
    const outfit = mockOutfits.find((o) => o.id === outfitId);
    if (!outfit || !outfit.wornDate) {
      return true;
    }

    const wornDate = new Date(outfit.wornDate);
    const daysDiff = Math.floor((Date.now() - wornDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= daysSince;
  }
}

export const outfitService = new OutfitService();




