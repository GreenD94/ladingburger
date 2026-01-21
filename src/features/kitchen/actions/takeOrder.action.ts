'use server';

import { connectToDatabase } from '@/features/database/connection';
import { OrderStatus, OrderStatusLabels, Order } from '@/features/database/types/index.type';
import { ObjectId } from 'mongodb';
import { canTransitionToStatus } from '@/features/orders/utils/validateStatusTransition.util';

export async function takeOrder(orderId: string, chefId: string) {
  const db = await connectToDatabase();
  const orders = db.collection<Order>('orders');

  const currentOrder = await orders.findOne({ _id: new ObjectId(orderId) });
  if (!currentOrder) {
    return {
      success: false,
      error: 'Order not found',
    };
  }

  if (currentOrder.status !== OrderStatus.PENDING) {
    return {
      success: false,
      error: 'Order is not in pending status',
    };
  }

  if (!canTransitionToStatus(currentOrder.status, OrderStatus.COOKING)) {
    return {
      success: false,
      error: 'Invalid status transition',
    };
  }

  const now = new Date();
  const result = await orders.updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        status: OrderStatus.COOKING,
        assignedTo: chefId,
        cookingStartedAt: now,
        updatedAt: now,
      },
      $push: {
        logs: {
          status: OrderStatus.COOKING,
          statusName: OrderStatusLabels[OrderStatus.COOKING],
          createdAt: now,
          comment: `Order taken by chef: ${chefId}`,
        },
      },
    }
  );

  if (result.matchedCount === 0) {
    return {
      success: false,
      error: 'Order not found',
    };
  }

  return {
    success: true,
    message: 'Order taken successfully',
  };
}

