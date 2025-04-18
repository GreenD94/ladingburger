'use server'

import clientPromise from '../../config/mongodb';
import { Order,  OrderStatusLabels } from '../../types';

type OrderWithUser = Omit<Order, '_id' | 'createdAt' | 'updatedAt'>;

export async function createOrder(order: OrderWithUser) {
  'use server'
  try {
    const client = await clientPromise;
    const db = client.db('saborea');

    const now = new Date();
    const newOrder: Order = {
      ...order,
      createdAt: now,
      updatedAt: now,
      logs: [{
        status: order.status,
        statusName: OrderStatusLabels[order.status],
        createdAt: now
      }]
    };

    const result = await db.collection<Order>('orders').insertOne(newOrder);
    
    return {
      success: true,
      orderId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: 'Failed to create order',
    };
  }
} 