'use server';

import { connectToDatabase } from '../../actions/connect';
import { Order } from '../../types';
import { WithId, Document } from 'mongodb';

export async function getOrdersByPhone(phone: string) {
  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection('orders').find({ customerPhone: phone }).toArray();
    
    return orders.map((doc: WithId<Document>) => ({
      ...doc,
      _id: doc._id.toString()
    })) as Order[];
  } catch (error) {
    console.error('Error getting orders:', error);
    return null;
  }
} 