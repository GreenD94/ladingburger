'use server';

import clientPromise from '@/features/database/config/mongodb';
import { Order, OrderStatusType, OrderStatusLabels } from '@/features/database/types/index.type';
import { ObjectId } from 'mongodb';

export async function updateOrderStatus(orderId: string, status: OrderStatusType, comment?: string) {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    
    const now = new Date();
    const result = await db
      .collection<Order>('orders')
      .updateOne(
        { _id: new ObjectId(orderId) },
        { 
          $set: { 
            status,
            updatedAt: now
          },
          $push: {
            logs: {
              status,
              statusName: OrderStatusLabels[status],
              createdAt: now,
              comment: comment || ''
            }
          }
        }
      );

    if (result.matchedCount === 0) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    return {
      success: true,
      message: `Order status updated successfully`
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: 'Failed to update order status',
    };
  }
}

