import { Entitlements, APIResponse } from '../models';
import { mockEntitlements } from '../data/mockData';
import { FREE_PLAN_LIMITS, PRO_PLAN_LIMITS } from '../constants/limits';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EntitlementsService {
  async getEntitlements(userId: string): Promise<APIResponse<Entitlements>> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    let entitlements = mockEntitlements.find((e) => e.userId === userId);
    if (!entitlements) {
      entitlements = {
        userId,
        plan: 'free',
        closetItemCount: 0,
        generatesToday: 0,
        lastGenerateDate: new Date().toISOString().split('T')[0],
      };
      mockEntitlements.push(entitlements);
    }

    // Reset daily count if new day
    const today = new Date().toISOString().split('T')[0];
    if (entitlements.lastGenerateDate !== today) {
      entitlements.generatesToday = 0;
      entitlements.lastGenerateDate = today;
    }

    return { data: entitlements };
  }

  async upgradeToPro(userId: string): Promise<APIResponse<Entitlements>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let entitlements = mockEntitlements.find((e) => e.userId === userId);
    if (!entitlements) {
      entitlements = {
        userId,
        plan: 'pro',
        closetItemCount: 0,
        generatesToday: 0,
        lastGenerateDate: new Date().toISOString().split('T')[0],
      };
      mockEntitlements.push(entitlements);
    } else {
      entitlements.plan = 'pro';
    }

    await AsyncStorage.setItem('userPlan', 'pro');
    return { data: entitlements, message: 'Upgraded to Pro successfully' };
  }

  async checkClosetLimit(userId: string, currentCount: number): Promise<boolean> {
    const entitlements = await this.getEntitlements(userId);
    const limits = entitlements.data.plan === 'pro' ? PRO_PLAN_LIMITS : FREE_PLAN_LIMITS;
    return currentCount < limits.maxClosetItems;
  }

  async checkGenerateLimit(userId: string): Promise<boolean> {
    const entitlements = await this.getEntitlements(userId);
    const limits = entitlements.data.plan === 'pro' ? PRO_PLAN_LIMITS : FREE_PLAN_LIMITS;
    return entitlements.data.generatesToday < limits.maxGeneratesPerDay;
  }

  async incrementGenerateCount(userId: string): Promise<void> {
    const entitlements = mockEntitlements.find((e) => e.userId === userId);
    if (entitlements) {
      entitlements.generatesToday += 1;
      entitlements.lastGenerateDate = new Date().toISOString().split('T')[0];
    }
  }
}

export const entitlementsService = new EntitlementsService();

