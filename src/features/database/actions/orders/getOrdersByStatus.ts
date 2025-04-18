'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Order, OrderStatusType } from '@/features/database/types';
import { ObjectId } from 'mongodb';

export interface GetOrdersByStatusResponse {
  success: boolean;
  data?: Order[];
  error?: string;
}

function convertToPlainObject(doc: any): any {
  if (doc === null || doc === undefined) return doc;
  if (typeof doc !== 'object') return doc;
  
  if (doc instanceof ObjectId) {
    return doc.toString();
  }
  
  if (Array.isArray(doc)) {
    return doc.map(item => convertToPlainObject(item));
  }
  
  const plainObject: any = {};
  for (const [key, value] of Object.entries(doc)) {
    plainObject[key] = convertToPlainObject(value);
  }
  return plainObject;
}

export async function getOrdersByStatus(status: OrderStatusType): Promise<GetOrdersByStatusResponse> {
  try {
    const db = await connectToDatabase();
    
    const orders = await db
      .collection<Order>('orders')
      .find({ status })
      .sort({ createdAt: -1 })
      .toArray();

    // Convert MongoDB documents to plain objects
    const plainOrders = orders.map(order => convertToPlainObject(order));

    return {
      success: true,
      data: plainOrders
    };
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return {
      success: false,
      error: 'Failed to fetch orders'
    };
  }
} 