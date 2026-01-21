'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { Order, OrderStatusType } from '@/features/database/types/index.type';
import { WithId, Document } from 'mongodb';
import { EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';

export interface OrderFilters {
  searchText?: string;
  status?: OrderStatusType;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginatedOrdersResponse {
  orders: Order[];
  hasMore: boolean;
  total: number;
}

interface OrderDocument extends WithId<Document> {
  userId?: { toString(): string } | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  paymentInfo?: {
    paymentLogs?: unknown[];
    [key: string]: unknown;
  };
  logs?: unknown[];
  [key: string]: unknown;
}

const ORDERS_PER_PAGE = 20;

export async function getOrdersByCustomerPhonePaginated(
  phoneNumber: string,
  page: number = 1,
  filters?: OrderFilters
): Promise<PaginatedOrdersResponse> {
  try {
    const { db } = await connectToDatabase();
    
    const query: Record<string, unknown> = {
      customerPhone: phoneNumber,
    };

    if (filters?.status !== undefined) {
      query.status = filters.status;
    }

    if (filters?.minAmount !== undefined || filters?.maxAmount !== undefined) {
      query.totalPrice = {};
      if (filters.minAmount !== undefined) {
        query.totalPrice.$gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        query.totalPrice.$lte = filters.maxAmount;
      }
    }

    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    if (filters?.searchText && filters.searchText.trim() !== '') {
      const searchText = filters.searchText.trim();
      query.$or = [
        { orderNumber: { $regex: searchText, $options: 'i' } },
        { customerName: { $regex: searchText, $options: 'i' } },
        { 'paymentInfo.transferReference': { $regex: searchText, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * ORDERS_PER_PAGE;
    const limit = ORDERS_PER_PAGE + 1;

    const ordersDocs = await db.collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('orders').countDocuments(query);
    const hasMore = ordersDocs.length > ORDERS_PER_PAGE;
    const ordersToReturn = hasMore ? ordersDocs.slice(0, ORDERS_PER_PAGE) : ordersDocs;

    const orders = ordersToReturn.map((doc) => {
      const orderDoc = doc as unknown as OrderDocument;
      return {
        ...orderDoc,
        _id: orderDoc._id.toString(),
        userId: orderDoc.userId ? (typeof orderDoc.userId === 'string' ? orderDoc.userId : orderDoc.userId.toString()) : '',
        createdAt: new Date(orderDoc.createdAt),
        updatedAt: new Date(orderDoc.updatedAt),
        paymentInfo: {
          bankAccount: (orderDoc.paymentInfo?.bankAccount as string) || '',
          transferReference: (orderDoc.paymentInfo?.transferReference as string) || '',
        },
        logs: orderDoc.logs || [],
      };
    }) as Order[];

    return {
      orders,
      hasMore,
      total,
    };
  } catch (error) {
    console.error('Error getting paginated orders by customer phone:', error);
    return {
      orders: [],
      hasMore: false,
      total: 0,
    };
  }
}

