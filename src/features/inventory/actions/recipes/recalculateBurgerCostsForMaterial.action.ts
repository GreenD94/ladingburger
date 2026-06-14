'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Burger } from '@/features/database/types/burger.type';
import { ObjectId } from 'mongodb';
import { calculateBurgerCost } from './calculateBurgerCost.action';

export async function recalculateBurgerCostsForMaterial(materialId: string): Promise<void> {
  try {
    const db = await connectToDatabase();
    
    const burgers = await db.collection<Burger>('burgers').find({
      'recipe.materialRequirements.materialId': materialId,
    }).toArray();

    for (const burger of burgers) {
      if (burger._id) {
        const burgerId = typeof burger._id === 'string' ? burger._id : burger._id.toString();
        await calculateBurgerCost(burgerId);
      }
    }
  } catch (error) {
    console.error('Error recalculating burger costs for material:', error);
  }
}

