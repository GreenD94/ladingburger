'use server';

import { connectToDatabase } from '../connect';
import { ObjectId } from 'mongodb';

export async function deleteBurger(burgerId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    
    const result = await db.collection('burgers').deleteOne({ _id: new ObjectId(burgerId) });

    if (result.deletedCount === 0) {
      return {
        success: false,
        error: 'Burger not found',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting burger:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete burger',
    };
  }
}

