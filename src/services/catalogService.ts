import { CatalogItem, APIResponse, ItemCategory } from '../models';
import { mockCatalogItems } from '../data/mockData';

class CatalogService {
  async getCatalogItems(category?: ItemCategory): Promise<APIResponse<CatalogItem[]>> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    let items = mockCatalogItems;
    if (category) {
      items = items.filter((item) => item.category === category);
    }

    return { data: items };
  }

  async trackCatalogView(itemId: string): Promise<void> {
    // Simulate tracking
    console.log(`Tracked catalog view: ${itemId}`);
  }

  async trackCatalogClick(itemId: string): Promise<void> {
    // Simulate tracking
    console.log(`Tracked catalog click: ${itemId}`);
  }
}

export const catalogService = new CatalogService();




