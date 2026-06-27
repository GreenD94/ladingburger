'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Material, Bill } from '../../types/index.type';
import { ObjectId } from 'mongodb';

export interface CalculateWACResponse {
  success: boolean;
  averageCost?: number;
  error?: string;
}

export async function calculateWAC(materialId: string): Promise<CalculateWACResponse> {
  try {
    const db = await connectToDatabase();
    
    const activeBills = await db.collection<Bill>('bills')
      .find({
        status: 'active',
        'items.materialId': materialId,
      })
      .toArray();

    let totalValue = 0;
    let totalQuantity = 0;

    activeBills.forEach(bill => {
      bill.items.forEach(item => {
        if (item.materialId === materialId) {
          totalValue += item.totalCost;
          totalQuantity += item.quantity;
        }
      });
    });

    const averageCost = totalQuantity > 0 ? totalValue / totalQuantity : 0;

    const now = new Date();
    await db.collection<Material>('materials').updateOne(
      { _id: new ObjectId(materialId) },
      {
        $set: {
          averageCost,
          lastCalculatedAt: now,
          updatedAt: now,
        },
      }
    );

    return {
      success: true,
      averageCost,
    };
  } catch (error) {
    console.error('Error calculating WAC:', error);
    return {
      success: false,
      error: 'Failed to calculate weighted average cost',
    };
  }
}


