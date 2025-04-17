'use server'

import clientPromise from '../../config/mongodb';
import { Order } from '../../types/index';

export async function createOrder(order: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>) {
  'use server'
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    
    const newOrder = {
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Order>('orders').insertOne(newOrder);
    console.log('holaaaaaaaaaaaaaaa');
    return {
      success: true,
      orderId: result.insertedId.toString(),
    };
  } catch (error) {
    console.log('Error creating order:', error);
    return {
      success: false,
      error: 'Failed to create order',
    };
  }
} 