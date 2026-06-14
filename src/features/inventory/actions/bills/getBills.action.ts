'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Bill, BillStatus } from '../types/bill.type';

export interface GetBillsFilters {
  status?: BillStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface GetBillsResponse {
  success: boolean;
  data?: Bill[];
  error?: string;
}

export async function getBills(filters?: GetBillsFilters): Promise<GetBillsResponse> {
  try {
    const db = await connectToDatabase();
    const queryFilter: Record<string, unknown> = {};

    if (filters?.status) {
      queryFilter.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      queryFilter.purchaseDate = {};
      if (filters.startDate) {
        queryFilter.purchaseDate = { ...queryFilter.purchaseDate, $gte: filters.startDate };
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        queryFilter.purchaseDate = { ...queryFilter.purchaseDate, $lte: endDate };
      }
    }

    const bills = await db.collection<Bill>('bills')
      .find(queryFilter)
      .sort({ purchaseDate: -1 })
      .toArray();

    return {
      success: true,
      data: bills,
    };
  } catch (error) {
    console.error('Error fetching bills:', error);
    return {
      success: false,
      error: 'Failed to fetch bills',
    };
  }
}

