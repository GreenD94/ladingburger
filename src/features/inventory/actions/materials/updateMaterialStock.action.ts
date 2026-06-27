'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Material } from '../../types/material.type';
import { ObjectId } from 'mongodb';

export interface UpdateMaterialStockResponse {
  success: boolean;
  error?: string;
}

export async function updateMaterialStock(
  materialId: string,
  quantityChange: number
): Promise<UpdateMaterialStockResponse> {
  try {
    const db = await connectToDatabase();

    const result = await db.collection<Material>('materials').updateOne(
      { _id: new ObjectId(materialId) },
      {
        $inc: { currentStock: quantityChange },
        $set: { updatedAt: new Date() },
      }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        error: 'Material not found',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating material stock:', error);
    return {
      success: false,
      error: 'Failed to update material stock',
    };
  }
}


