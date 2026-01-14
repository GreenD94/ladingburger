import { Order, Burger, BusinessContact } from '@/features/database/types/index.type';

export type TestCategory = 'orders' | 'menu' | 'database' | 'business';

export type TestData = Order | Order[] | Burger[] | BusinessContact | { message: string };

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