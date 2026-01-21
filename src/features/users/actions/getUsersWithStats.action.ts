'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { User } from '@/features/database/types/user.type';
import { Order, OrderStatus } from '@/features/database/types/index.type';
import { WithId, Document } from 'mongodb';
import { EMPTY_STRING, EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';

export interface UserStats {
  totalOrders: number;
  lifetimeValue: number;
  lastOrderDate: Date;
  firstOrderDate: Date;
}

export interface UserWithStats extends User {
  stats: UserStats;
}

export interface GetUsersWithStatsResponse {
  success: boolean;
  data?: UserWithStats[];
  error?: string;
}

interface UserDocument extends WithId<Document> {
  phoneNumber: string;
  name?: string;
  birthdate?: Date;
  gender?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface OrderDocument extends WithId<Document> {
  customerPhone: string;
  totalPrice: number;
  status: number;
  createdAt: Date;
  [key: string]: unknown;
}


export async function getUsersWithStatsAction(): Promise<GetUsersWithStatsResponse> {
  try {
    const { db } = await connectToDatabase();

    const usersCollection = db.collection('users');
    const ordersCollection = db.collection('orders');

    const usersDocs = await usersCollection.find().toArray();
    const allOrdersDocs = await ordersCollection.find().toArray();

    const ordersByPhone = new Map<string, OrderDocument[]>();
    
    allOrdersDocs.forEach((doc) => {
      const orderDoc = doc as unknown as OrderDocument;
      const phone = orderDoc.customerPhone || EMPTY_STRING;
      if (phone !== EMPTY_STRING) {
        if (!ordersByPhone.has(phone)) {
          ordersByPhone.set(phone, []);
        }
        ordersByPhone.get(phone)?.push(orderDoc);
      }
    });

    const now = new Date();
    const usersWithStats: UserWithStats[] = usersDocs.map((userDoc) => {
      const user = userDoc as unknown as UserDocument;
      const phone = user.phoneNumber || EMPTY_STRING;
      const userOrders = ordersByPhone.get(phone) || [];

      const completedOrders = userOrders.filter(
        (order) => {
          const status = typeof order.status === 'number' ? order.status : parseInt(String(order.status || 0), 10);
          return status === OrderStatus.COMPLETED;
        }
      );

      const totalOrders = completedOrders.length;
      const lifetimeValue = completedOrders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );

      const orderDates = completedOrders
        .map((order) => new Date(order.createdAt))
        .filter((date) => !isNaN(date.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

      const firstOrderDate = orderDates.length > 0 ? orderDates[0] : EMPTY_DATE;
      const lastOrderDate = orderDates.length > 0 ? orderDates[orderDates.length - 1] : EMPTY_DATE;

      return {
        _id: user._id?.toString() || EMPTY_STRING,
        phoneNumber: user.phoneNumber || EMPTY_STRING,
        name: user.name || EMPTY_STRING,
        birthdate: user.birthdate ? new Date(user.birthdate) : undefined,
        gender: user.gender || EMPTY_STRING,
        notes: user.notes || EMPTY_STRING,
        tags: user.tags || [],
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        stats: {
          totalOrders,
          lifetimeValue,
          lastOrderDate,
          firstOrderDate,
        },
      };
    });

    usersWithStats.sort((a, b) => {
      const aTime = a.stats.lastOrderDate.getTime();
      const bTime = b.stats.lastOrderDate.getTime();
      if (aTime === EMPTY_DATE.getTime() && bTime === EMPTY_DATE.getTime()) return 0;
      if (aTime === EMPTY_DATE.getTime()) return 1;
      if (bTime === EMPTY_DATE.getTime()) return -1;
      return bTime - aTime;
    });

    return {
      success: true,
      data: usersWithStats,
    };
  } catch (error) {
    console.error('Error fetching users with stats:', error);
    return {
      success: false,
      error: 'Error al cargar los usuarios',
    };
  }
}

