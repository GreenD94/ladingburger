'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Order, OrderStatusType } from '@/features/database/types/index.type';
import { ObjectId } from 'mongodb';

export interface GetOrdersByStatusResponse {
  success: boolean;
  data?: Order[];
  error?: string;
}

interface MongoOrderDocument {
  _id: { toString(): string };
  createdAt: { toISOString(): string };
  updatedAt: { toISOString(): string };
  items: Array<{
    burgerId: { toString(): string };
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

function convertToPlainObject(doc: MongoOrderDocument): Order {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: new Date(doc.createdAt.toISOString()),
    updatedAt: new Date(doc.updatedAt.toISOString()),
    items: doc.items.map((item) => ({
      ...item,
      burgerId: item.burgerId.toString()
    })) as Order['items']
  } as Order;
}

export async function getOrdersByStatus(status: OrderStatusType): Promise<GetOrdersByStatusResponse> {
  try {
    const db = await connectToDatabase();
    
    const orders = await db
      .collection<Order>('orders')
      .find({ status })
      .sort({ createdAt: -1 })
      .toArray();

    const plainOrders = orders.map(order => convertToPlainObject(order as unknown as MongoOrderDocument));

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

