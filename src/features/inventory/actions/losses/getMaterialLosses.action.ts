'use server';

import { connectToDatabase } from '@/features/database/connection';
import { MaterialLoss } from '../../types/loss.type';

export interface GetMaterialLossesFilters {
  materialId?: string;
  billId?: string;
  startDate?: Date;
  endDate?: Date;
  cause?: string;
}

export interface GetMaterialLossesResponse {
  success: boolean;
  data?: MaterialLoss[];
  error?: string;
}

export async function getMaterialLosses(
  filters?: GetMaterialLossesFilters
): Promise<GetMaterialLossesResponse> {
  try {
    const db = await connectToDatabase();
    const queryFilter: Record<string, unknown> = {};

    if (filters?.materialId) {
      queryFilter.materialId = filters.materialId;
    }

    if (filters?.billId) {
      queryFilter.billId = filters.billId;
    }

    if (filters?.cause) {
      queryFilter.cause = filters.cause;
    }

    if (filters?.startDate || filters?.endDate) {
      queryFilter.lossDate = {};
      if (filters.startDate) {
        queryFilter.lossDate = { ...(queryFilter.lossDate as Record<string, unknown>), $gte: filters.startDate };
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        queryFilter.lossDate = { ...(queryFilter.lossDate as Record<string, unknown>), $lte: endDate };
      }
    }

    const losses = await db.collection<MaterialLoss>('materialLosses')
      .find(queryFilter)
      .sort({ lossDate: -1 })
      .toArray();

    return {
      success: true,
      data: losses,
    };
  } catch (error) {
    console.error('Error fetching material losses:', error);
    return {
      success: false,
      error: 'Failed to fetch material losses',
    };
  }
}

