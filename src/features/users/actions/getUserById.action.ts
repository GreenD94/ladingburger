'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { User } from '@/features/database/types/user.type';
import { Order, OrderStatus } from '@/features/database/types/index.type';
import { WithId, Document, ObjectId } from 'mongodb';
import { EMPTY_STRING, EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';
import { UserWithStats, UserStats } from './getUsersWithStats.action';

export interface GetUserByIdResponse {
  success: boolean;
  data?: UserWithStats;
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

export async function getUserByIdAction(userId: string): Promise<GetUserByIdResponse> {
  try {
    const { db } = await connectToDatabase();

    const usersCollection = db.collection('users');
    const ordersCollection = db.collection('orders');

    let userDoc;
    try {
      const objectId = new ObjectId(userId);
      userDoc = await usersCollection.findOne({ _id: objectId });
    } catch {
      userDoc = await usersCollection.findOne({ _id: userId });
    }

    if (!userDoc) {
      return {
        success: false,
        error: 'Usuario no encontrado',
      };
    }

    const user = userDoc as unknown as UserDocument;
    const phone = user.phoneNumber || EMPTY_STRING;

    const allOrdersDocs = await ordersCollection.find({ customerPhone: phone }).toArray();
    const userOrders = allOrdersDocs as unknown as OrderDocument[];

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

    const averageOrderValue = totalOrders > 0 ? lifetimeValue / totalOrders : 0;

    const stats: UserStats = {
      totalOrders,
      lifetimeValue,
      lastOrderDate,
      firstOrderDate,
    };

    const userWithStats: UserWithStats = {
      _id: user._id?.toString() || EMPTY_STRING,
      phoneNumber: user.phoneNumber || EMPTY_STRING,
      name: user.name || EMPTY_STRING,
      birthdate: user.birthdate ? new Date(user.birthdate) : undefined,
      gender: user.gender || EMPTY_STRING,
      notes: user.notes || EMPTY_STRING,
      tags: user.tags || [],
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
      stats,
    };

    return {
      success: true,
      data: userWithStats,
    };
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return {
      success: false,
      error: 'Error al cargar el usuario',
    };
  }
}

