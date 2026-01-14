'use server';

import { connectToDatabase } from '@/features/database/connection';
import { getTopSellingItems } from '@/features/database/models/analytics.model';
import { TopSellingItem } from '@/features/database/models/analytics.model';

export interface TopSellingItemsResponse {
  success: boolean;
  data?: TopSellingItem[];
  error?: string;
}

export async function getTopSellingItemsAction(days: number): Promise<TopSellingItemsResponse> {
  try {
    const db = await connectToDatabase();
    const topSellingItems = await getTopSellingItems(db, days);
    
    return {
      success: true,
      data: topSellingItems
    };
  } catch (error) {
    console.error('Error fetching top selling items:', error);
    return {
      success: false,
      error: 'Failed to fetch top selling items data'
    };
  }
}

