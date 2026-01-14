'use server';

import { connectToDatabase } from '@/features/database/connection';
import { getPeakHours } from '@/features/database/models/analytics.model';

export interface PeakHoursResponse {
  success: boolean;
  data?: {
    hour: number;
    orders: number;
  }[];
  error?: string;
}

export async function getPeakHoursAction(date: Date): Promise<PeakHoursResponse> {
  try {
    const db = await connectToDatabase();
    const peakHours = await getPeakHours(db, date);
    
    return {
      success: true,
      data: peakHours
    };
  } catch (error) {
    console.error('Error fetching peak hours:', error);
    return {
      success: false,
      error: 'Failed to fetch peak hours data'
    };
  }
}

