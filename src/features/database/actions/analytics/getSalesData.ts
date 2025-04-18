'use server';

import { connectToDatabase } from '@/features/database/connection';
import { getSalesData } from '@/features/database/models/analytics.model';
import { SalesData } from '@/features/database/models/analytics.model';

export interface SalesDataResponse {
  success: boolean;
  data?: SalesData[];
  error?: string;
}

export async function getSalesDataAction(days: number): Promise<SalesDataResponse> {
  try {
    const db = await connectToDatabase();
    const salesData = await getSalesData(db, days);
    
    return {
      success: true,
      data: salesData
    };
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return {
      success: false,
      error: 'Failed to fetch sales data'
    };
  }
} 