'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Order, OrderStatusType, User } from '@/features/database/types/index.type';
import { ObjectId } from 'mongodb';

export interface GetOrdersByStatusResponse {
  success: boolean;
  data?: Order[];
  total: number; // Always returns a number (0 if not calculated)
  error?: string;
}

export interface GetOrdersByStatusParams {
  status: OrderStatusType;
  hoursAgo?: number; // Filter orders created within last N hours (e.g., 24 for 24-hour filter)
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
  searchQuery?: string; // Search by phone, name, orderNumber, or orderId
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
    orderNumber: doc.orderNumber as number | undefined,
    createdAt: new Date(doc.createdAt.toISOString()),
    updatedAt: new Date(doc.updatedAt.toISOString()),
    items: doc.items.map((item) => ({
      ...item,
      burgerId: item.burgerId.toString()
    })) as Order['items']
  } as Order;
}

export async function getOrdersByStatus(params: GetOrdersByStatusParams): Promise<GetOrdersByStatusResponse> {
  try {
    const { status, hoursAgo, startDate, endDate, limit, skip, searchQuery } = params;
    const db = await connectToDatabase();
    
    // Build query filter
    const queryFilter: Record<string, unknown> = { status };

    // Add date filter
    if (hoursAgo !== undefined) {
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - hoursAgo);
      queryFilter.createdAt = { $gte: cutoffDate };
    } else if (startDate || endDate) {
      queryFilter.createdAt = {};
      if (startDate) {
        queryFilter.createdAt = { ...queryFilter.createdAt, $gte: startDate };
      }
      if (endDate) {
        const endDateWithTime = new Date(endDate);
        endDateWithTime.setHours(23, 59, 59, 999);
        queryFilter.createdAt = { ...queryFilter.createdAt, $lte: endDateWithTime };
      }
    }

    // Add search filter if provided
    if (searchQuery && searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase().trim();
      queryFilter.$or = [
        { customerPhone: { $regex: searchLower, $options: 'i' } },
        { customerName: { $regex: searchLower, $options: 'i' } },
        { orderNumber: { $regex: searchLower, $options: 'i' } },
      ];
      
      // Also search by orderId if it looks like an ObjectId
      if (ObjectId.isValid(searchLower)) {
        queryFilter.$or.push({ _id: new ObjectId(searchLower) });
      }
    }

    // Build query
    let query = db
      .collection<Order>('orders')
      .find(queryFilter)
      .sort({ createdAt: -1 });

    // Add pagination
    if (skip !== undefined) {
      query = query.skip(skip);
    }
    if (limit !== undefined) {
      query = query.limit(limit);
    }

    // Get total count for pagination (only if limit is provided)
    let total = 0;
    if (limit !== undefined) {
      total = await db.collection<Order>('orders').countDocuments(queryFilter);
    }

    const orders = await query.toArray();
    const plainOrders = orders.map(order => convertToPlainObject(order as unknown as MongoOrderDocument));

    const ordersNeedingName = plainOrders.filter(order => !order.customerName && order.userId);
    if (ordersNeedingName.length > 0) {
      const userIds = [...new Set(ordersNeedingName.map(order => order.userId).filter((id): id is string => !!id))];
      const userIdsAsObjectIds = userIds
        .map(id => {
          try {
            return new ObjectId(id);
          } catch {
            return null;
          }
        })
        .filter((id): id is ObjectId => id !== null);

      if (userIdsAsObjectIds.length > 0) {
        const users = await db.collection<User>('users')
          .find({ _id: { $in: userIdsAsObjectIds } })
          .toArray();

        const userMap = new Map<string, string>();
        users.forEach(user => {
          if (user._id && user.name) {
            const userIdStr = typeof user._id === 'string' ? user._id : user._id.toString();
            userMap.set(userIdStr, user.name);
          }
        });

        const ordersToUpdate: Array<{ orderId: string; customerName: string }> = [];
        plainOrders.forEach(order => {
          if (!order.customerName && order.userId) {
            const userName = userMap.get(order.userId);
            if (userName) {
              order.customerName = userName;
              if (order._id) {
                ordersToUpdate.push({
                  orderId: typeof order._id === 'string' ? order._id : order._id.toString(),
                  customerName: userName,
                });
              }
            }
          }
        });

        if (ordersToUpdate.length > 0) {
          await Promise.all(
            ordersToUpdate.map(({ orderId, customerName }) =>
              db.collection<Order>('orders').updateOne(
                { _id: new ObjectId(orderId) },
                { $set: { customerName, updatedAt: new Date() } }
              )
            )
          );
        }
      }
    }

    return {
      success: true,
      data: plainOrders,
      total
    };
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return {
      success: false,
      error: 'Failed to fetch orders'
    };
  }
}

