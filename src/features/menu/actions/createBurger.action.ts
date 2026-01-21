'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { Burger, BurgerImage } from '@/features/database/types/index.type';
import { ObjectId } from 'mongodb';

export interface CreateBurgerInput {
  name: string;
  description: string;
  price: number;
  ingredients: string[];
  image: BurgerImage;
  isAvailable: boolean;
  estimatedPrepTime?: number;
}

export async function createBurger(burgerData: CreateBurgerInput): Promise<{ success: boolean; data?: Burger; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    
    const newBurger = {
      ...burgerData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('burgers').insertOne(newBurger);
    
    const createdBurger: Burger = {
      _id: result.insertedId.toString(),
      ...burgerData,
    };

    return {
      success: true,
      data: createdBurger,
    };
  } catch (error) {
    console.error('Error creating burger:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create burger',
    };
  }
}

