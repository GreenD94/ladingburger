'use server';

import clientPromise from '@/features/database/config/mongodb';
import { Order, OrderStatusType, OrderStatusLabels, OrderStatus } from '@/features/database/types/index.type';
import { ObjectId } from 'mongodb';
import { canTransitionToStatus } from '../utils/validateStatusTransition.util';
import { recalculateUserEtiquetasForOrderChanges } from '@/features/etiquetas/utils/userTags.util';

export async function updateOrderStatus(orderId: string, status: OrderStatusType, comment?: string, cancelledBy?: string) {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    
    const currentOrder = await db.collection<Order>('orders').findOne({ _id: new ObjectId(orderId) });
    
    if (!currentOrder) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    if (!canTransitionToStatus(currentOrder.status, status)) {
      return {
        success: false,
        error: `Invalid status transition from ${OrderStatusLabels[currentOrder.status]} to ${OrderStatusLabels[status]}`,
      };
    }
    
    const now = new Date();
    const updateData: Partial<Order> = {
      status,
      updatedAt: now,
    };

    if (status === OrderStatus.CANCELLED) {
      updateData.cancelledAt = now;
      updateData.cancellationReason = comment || '';
      if (cancelledBy) {
        updateData.cancelledBy = cancelledBy;
      }
    }

    if (status === OrderStatus.READY && currentOrder.cookingStartedAt) {
      const cookingStartTime = new Date(currentOrder.cookingStartedAt).getTime();
      const cookingEndTime = now.getTime();
      const actualPrepTimeMinutes = Math.floor((cookingEndTime - cookingStartTime) / 1000 / 60);
      updateData.actualPrepTime = actualPrepTimeMinutes;
    }

    const result = await db
      .collection<Order>('orders')
      .updateOne(
        { _id: new ObjectId(orderId) },
        { 
          $set: updateData,
          $push: {
            logs: {
              status,
              statusName: OrderStatusLabels[status],
              createdAt: now,
              comment: comment || ''
            }
          }
        }
      );

    if (result.matchedCount === 0) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    // Recalculate user etiquetas after order status change
    if (currentOrder.userId || currentOrder.customerPhone) {
      try {
        const userId = currentOrder.userId || '';
        const customerPhone = currentOrder.customerPhone || '';
        if (userId || customerPhone) {
          await recalculateUserEtiquetasForOrderChanges(userId, customerPhone);
        }
      } catch (etiquetaError) {
        console.error('Error recalculating etiquetas after order status update:', etiquetaError);
        // Don't fail status update if etiqueta recalculation fails
      }
    }

    return {
      success: true,
      message: `Order status updated successfully`
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: 'Failed to update order status',
    };
  }
}

