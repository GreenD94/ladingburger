'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Order, OrderStatusType } from '@/features/database/types';
import { ObjectId } from 'mongodb';

export interface GetOrdersByStatusResponse {
  success: boolean;
  data?: Order[];
  error?: string;
}

function convertToPlainObject(doc: any) {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    items: doc.items.map((item: any) => ({
      ...item,
      burgerId: item.burgerId.toString()
    }))
  };
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