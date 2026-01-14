'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { Order } from '@/features/database/types/index.type';
import { WithId, Document } from 'mongodb';

export interface CustomerOrderStats {
  totalOrders: number;
  lifetimeValue: number;
  averageOrderValue: number;
  lastOrderDate: Date;
  firstOrderDate: Date;
}

export interface CustomerOrdersResponse {
  orders: Order[];
  stats: CustomerOrderStats;
}

interface PaymentLogDocument {
  status: number;
  statusName: string;
  createdAt: Date | string;
  comment?: string;
}

interface OrderLogDocument {
  status: number;
  statusName: string;
  createdAt: Date | string;
  comment?: string;
}

interface OrderDocument extends WithId<Document> {
  userId?: { toString(): string } | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  paymentInfo?: {
    paymentLogs?: PaymentLogDocument[];
    [key: string]: unknown;
  };
  logs?: OrderLogDocument[];
  [key: string]: unknown;
}

export async function getOrdersByCustomerPhone(phoneNumber: string): Promise<CustomerOrdersResponse> {
  try {
    const { db } = await connectToDatabase();
    
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
          lastOrderDate: new Date(0),
          firstOrderDate: new Date(0),
        },
      };
    }

    const orders = ordersDocs.map((doc) => {
      const orderDoc = doc as unknown as OrderDocument;
      return {
        ...orderDoc,
        _id: orderDoc._id.toString(),
        userId: orderDoc.userId ? (typeof orderDoc.userId === 'string' ? orderDoc.userId : orderDoc.userId.toString()) : '',
        createdAt: new Date(orderDoc.createdAt),
        updatedAt: new Date(orderDoc.updatedAt),
        paymentInfo: {
          ...orderDoc.paymentInfo,
          paymentLogs: (orderDoc.paymentInfo?.paymentLogs || []).map((log: PaymentLogDocument) => ({
            ...log,
            createdAt: new Date(log.createdAt),
          })),
        },
        logs: (orderDoc.logs || []).map((log: OrderLogDocument) => ({
          ...log,
          createdAt: new Date(log.createdAt),
        })),
      };
    }) as Order[];

    const totalOrders = orders.length;
    const lifetimeValue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalOrders > 0 ? lifetimeValue / totalOrders : 0;
    
    const orderDates = orders.map(order => new Date(order.createdAt)).sort((a, b) => a.getTime() - b.getTime());
    const firstOrderDate = orderDates.length > 0 ? orderDates[0] : new Date(0);
    const lastOrderDate = orderDates.length > 0 ? orderDates[orderDates.length - 1] : new Date(0);

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
    return {
      orders: [],
      stats: {
        totalOrders: 0,
        lifetimeValue: 0,
        averageOrderValue: 0,
        lastOrderDate: new Date(0),
        firstOrderDate: new Date(0),
      },
    };
  }
}

