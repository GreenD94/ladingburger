'use server';

import { connectToDatabase } from '@/features/database/connection';
import { getCustomerAnalytics, CustomerAnalytics } from '@/features/database/models/analytics.model';

interface CustomerAnalyticsResponse {
  success: boolean;
  data?: CustomerAnalytics;
  error?: string;
}

export async function getCustomerAnalyticsAction(days: number): Promise<CustomerAnalyticsResponse> {
  try {
    const db = await connectToDatabase();
    const data = await getCustomerAnalytics(db, days);
    return { success: true, data };
  } catch (error) {
    console.error('Error getting customer analytics:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get customer analytics' 
    };
  }
} 