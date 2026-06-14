'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Material } from '../types/material.type';
import { ObjectId } from 'mongodb';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export interface UpdateMaterialInput {
  name?: string;
  unit?: string;
  category?: string;
  minStockLevel?: number;
}

export interface UpdateMaterialResponse {
  success: boolean;
  error?: string;
}

export async function updateMaterial(
  materialId: string,
  input: UpdateMaterialInput
): Promise<UpdateMaterialResponse> {
  try {
    const db = await connectToDatabase();
    const updateData: Partial<Material> = {
      updatedAt: new Date(),
    };

    if (input.name !== undefined) {
      updateData.name = input.name.trim();
    }

    if (input.unit !== undefined) {
      updateData.unit = input.unit.trim();
    }

    if (input.category !== undefined) {
      updateData.category = input.category;
    }

    if (input.minStockLevel !== undefined) {
      updateData.minStockLevel = input.minStockLevel;
    }

    const result = await db.collection<Material>('materials').updateOne(
      { _id: new ObjectId(materialId) },
      { $set: updateData }
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
    console.error('Error updating material:', error);
    return {
      success: false,
      error: 'Failed to update material',
    };
  }
}

