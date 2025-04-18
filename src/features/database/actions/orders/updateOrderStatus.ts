'use server';

import clientPromise from '../../config/mongodb';
import { Order, OrderStatusType, OrderStatusLabels } from '../../types';
import { ObjectId } from 'mongodb';

export async function updateOrderStatus(orderId: string, status: OrderStatusType) {
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
              createdAt: now
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