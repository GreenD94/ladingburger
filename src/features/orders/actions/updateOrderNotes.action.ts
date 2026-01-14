'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { ObjectId } from 'mongodb';

export async function updateOrderNotes(
  orderId: string,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          internalNotes: notes,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating order notes:', error);
    return {
      success: false,
      error: 'Failed to update order notes',
    };
  }
}

