import { Order, Burger } from '@/features/database/types/index';

export type TestCategory = 'orders' | 'menu' | 'database';

export type TestData = Order | Order[] | Burger[] | { message: string };

export interface TestItem {
  id: string;
  name: string;
  category: TestCategory;
  description: string;
  run: () => Promise<{ success: boolean; data?: TestData; error?: string; message?: string }>;
}

export interface TestResult {
  success: boolean;
  data?: TestData;
  error?: string;
  message?: string;
} 