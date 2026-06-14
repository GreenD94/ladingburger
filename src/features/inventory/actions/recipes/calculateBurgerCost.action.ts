'use server';

import { connectToDatabase } from '@/features/database/connection';
import { BurgerRecipe, MaterialRequirement } from '../types/recipe.type';
import { Material } from '../types/material.type';
import { Burger } from '@/features/database/types/burger.type';
import { ObjectId } from 'mongodb';
import { EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';

export interface CalculateBurgerCostResponse {
  success: boolean;
  cost?: number;
  error?: string;
}

export async function calculateBurgerCost(burgerId: string): Promise<CalculateBurgerCostResponse> {
  try {
    const db = await connectToDatabase();
    
    const burger = await db.collection<Burger>('burgers').findOne({
      _id: new ObjectId(burgerId),
    });

    if (!burger || !burger.recipe) {
      return {
        success: false,
        error: 'Burger or recipe not found',
      };
    }

    let totalCost = 0;
    const materialCosts: {
      materialId: string;
      quantity: number;
      unitCost: number;
      totalCost: number;
    }[] = [];

    for (const requirement of burger.recipe.materialRequirements) {
      const material = await db.collection<Material>('materials').findOne({
        _id: new ObjectId(requirement.materialId),
      });

      if (material) {
        const materialCost = requirement.quantity * material.averageCost;
        totalCost += materialCost;

        materialCosts.push({
          materialId: requirement.materialId,
          quantity: requirement.quantity,
          unitCost: material.averageCost,
          totalCost: materialCost,
        });
      }
    }

    const now = new Date();
    await db.collection<Burger>('burgers').updateOne(
      { _id: new ObjectId(burgerId) },
      {
        $set: {
          'recipe.currentCost': totalCost,
          'recipe.lastCostUpdate': now,
          updatedAt: now,
        },
      }
    );

    return {
      success: true,
      cost: totalCost,
    };
  } catch (error) {
    console.error('Error calculating burger cost:', error);
    return {
      success: false,
      error: 'Failed to calculate burger cost',
    };
  }
}

