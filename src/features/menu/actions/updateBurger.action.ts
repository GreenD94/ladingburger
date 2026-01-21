'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { Burger } from '@/features/database/types/index.type';
import { ObjectId } from 'mongodb';

export interface UpdateBurgerInput {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  ingredients?: string[];
  image?: string;
  isAvailable?: boolean;
  estimatedPrepTime?: number;
}

interface UpdateFields {
  name?: string;
  description?: string;
  price?: number;
  ingredients?: string[];
  image?: string;
  isAvailable?: boolean;
  estimatedPrepTime?: number;
  updatedAt: Date;
}

export async function updateBurger(burgerData: UpdateBurgerInput): Promise<{ success: boolean; data?: Burger; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    const { _id, ...updateData } = burgerData;

    const updateFields: UpdateFields = {
      ...updateData,
      updatedAt: new Date(),
    };

    Object.keys(updateFields).forEach(key => {
      const typedKey = key as keyof UpdateFields;
      if (updateFields[typedKey] === undefined) {
        delete updateFields[typedKey];
      }
    });

    const result = await db.collection('burgers').findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      return {
        success: false,
        error: 'Burger not found',
      };
    }

    const updatedBurger: Burger = {
      ...result,
      _id: result._id.toString(),
    } as Burger;

    return {
      success: true,
      data: updatedBurger,
    };
  } catch (error) {
    console.error('Error updating burger:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update burger',
    };
  }
}

