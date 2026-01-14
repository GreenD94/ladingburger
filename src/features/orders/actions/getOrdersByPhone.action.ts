'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { Order } from '@/features/database/types/index.type';
import { WithId, Document } from 'mongodb';

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection('orders').find({ customerPhone: phone }).toArray();
    
    return orders.map((doc: WithId<Document>) => ({
      ...doc,
      _id: doc._id.toString()
    })) as Order[];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
}

