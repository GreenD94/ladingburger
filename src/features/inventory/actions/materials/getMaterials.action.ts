'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Material } from '../../types/material.type';

export interface GetMaterialsResponse {
  success: boolean;
  data?: Material[];
  error?: string;
}

export async function getMaterials(): Promise<GetMaterialsResponse> {
  try {
    const db = await connectToDatabase();
    const materials = await db.collection<Material>('materials')
      .find({})
      .sort({ name: 1 })
      .toArray();

    return {
      success: true,
      data: materials,
    };
  } catch (error) {
    console.error('Error fetching materials:', error);
    return {
      success: false,
      error: 'Failed to fetch materials',
    };
  }
}


