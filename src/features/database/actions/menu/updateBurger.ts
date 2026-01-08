'use server';

import { connectToDatabase } from '../connect';
import { Burger } from '../../types/burger';
import { ObjectId } from 'mongodb';

export interface UpdateBurgerInput {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  ingredients?: string[];
  image?: string;
  category?: string;
  isAvailable?: boolean;
}

export async function updateBurger(burgerData: UpdateBurgerInput): Promise<{ success: boolean; data?: Burger; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    const { _id, ...updateData } = burgerData;

    const updateFields: any = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Remove undefined fields
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
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

