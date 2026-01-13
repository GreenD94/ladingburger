'use server';

import { connectToDatabase } from '../../actions/connect';
import { Order } from '../../types';
import { WithId, Document } from 'mongodb';

export interface CustomerOrderStats {
  totalOrders: number;
  lifetimeValue: number;
  averageOrderValue: number;
  lastOrderDate: Date | null;
  firstOrderDate: Date | null;
}

export interface CustomerOrdersResponse {
  orders: Order[];
  stats: CustomerOrderStats;
}

export async function getOrdersByCustomerPhone(phoneNumber: string): Promise<CustomerOrdersResponse | null> {
  try {
    const { db } = await connectToDatabase();
    
    // Find all orders for this customer
    const ordersDocs = await db.collection('orders')
      .find({ customerPhone: phoneNumber })
      .sort({ createdAt: -1 })
      .toArray();

    if (ordersDocs.length === 0) {
      return {
        orders: [],
        stats: {
          totalOrders: 0,
          lifetimeValue: 0,
          averageOrderValue: 0,
          lastOrderDate: null,
          firstOrderDate: null,
        },
      };
    }

    const orders = ordersDocs.map((doc: WithId<Document>) => ({
      ...doc,
      _id: doc._id.toString(),
      userId: doc.userId?.toString() || doc.userId,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
      paymentInfo: {
        ...doc.paymentInfo,
        paymentLogs: (doc.paymentInfo?.paymentLogs || []).map((log: any) => ({
          ...log,
          createdAt: new Date(log.createdAt),
        })),
      },
      logs: (doc.logs || []).map((log: any) => ({
        ...log,
        createdAt: new Date(log.createdAt),
      })),
    })) as Order[];

    // Calculate statistics
    const totalOrders = orders.length;
    const lifetimeValue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalOrders > 0 ? lifetimeValue / totalOrders : 0;
    
    const orderDates = orders.map(order => new Date(order.createdAt)).sort((a, b) => a.getTime() - b.getTime());
    const firstOrderDate = orderDates.length > 0 ? orderDates[0] : null;
    const lastOrderDate = orderDates.length > 0 ? orderDates[orderDates.length - 1] : null;

    return {
      orders,
      stats: {
        totalOrders,
        lifetimeValue,
        averageOrderValue,
        lastOrderDate,
        firstOrderDate,
      },
    };
  } catch (error) {
    console.error('Error getting orders by customer phone:', error);
    return null;
  }
}

