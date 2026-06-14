'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Material } from '../types/material.type';
import { ObjectId } from 'mongodb';
import { EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';

export interface CreateMaterialInput {
  name: string;
  unit: string;
  category: string;
  minStockLevel: number;
}

export interface CreateMaterialResponse {
  success: boolean;
  data?: Material;
  error?: string;
}

export async function createMaterial(input: CreateMaterialInput): Promise<CreateMaterialResponse> {
  try {
    const db = await connectToDatabase();
    const now = new Date();

    const newMaterial: Material = {
      name: input.name.trim(),
      unit: input.unit.trim(),
      category: input.category,
      currentStock: 0,
      averageCost: 0,
      minStockLevel: input.minStockLevel,
      lastCalculatedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection<Material>('materials').insertOne(newMaterial);

    return {
      success: true,
      data: {
        ...newMaterial,
        _id: result.insertedId.toString(),
      },
    };
  } catch (error) {
    console.error('Error creating material:', error);
    return {
      success: false,
      error: 'Failed to create material',
    };
  }
}

