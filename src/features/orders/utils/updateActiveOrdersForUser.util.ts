'use server';

import { connectToDatabase } from '@/features/database/connection';
import { OrderStatus, Order } from '@/features/database/types/index.type';
import { ObjectId } from 'mongodb';

const INACTIVE_STATUSES = [
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
];

export async function updateActiveOrdersForUser(
  userId: string,
  oldPhoneNumber: string,
  newPhoneNumber?: string,
  newCustomerName?: string
): Promise<void> {
  const db = await connectToDatabase();
  const ordersCollection = db.collection<Order>('orders');

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (newPhoneNumber !== undefined && newPhoneNumber !== oldPhoneNumber) {
    updateData.customerPhone = newPhoneNumber;
  }

  if (newCustomerName !== undefined) {
    updateData.customerName = newCustomerName.trim() || undefined;
  }

  if (Object.keys(updateData).length <= 1) {
    return;
  }

  const query: Record<string, unknown> = {
    userId: userId,
    status: { $nin: INACTIVE_STATUSES },
  };

  await ordersCollection.updateMany(query, { $set: updateData });
}

