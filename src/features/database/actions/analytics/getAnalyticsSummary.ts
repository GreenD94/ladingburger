'use server';

import { getAnalyticsSummary } from '@/features/database/models/analytics.model';
import clientPromise from '@/features/database/config/mongodb';

export async function getAnalyticsSummaryAction(days: number) {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    
    const summary = await getAnalyticsSummary(db, days);
    return { success: true, data: summary };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return { success: false, error: 'Failed to get analytics summary' };
  }
} 