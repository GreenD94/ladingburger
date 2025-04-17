'use server';

import clientPromise from '../../config/mongodb';
import { Order, OrderStatusType } from '../../types/index';
import { ObjectId } from 'mongodb';

export async function updateOrderStatus(orderId: string, status: OrderStatusType) {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    
    const result = await db
      .collection<Order>('orders')
      .updateOne(
        { _id: new ObjectId(orderId) },
        { 
          $set: { 
            status,
            updatedAt: new Date()
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