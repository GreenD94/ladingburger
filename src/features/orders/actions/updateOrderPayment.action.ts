'use server';

import { connectToDatabase } from '@/features/database/connection';
import { OrderStatus, OrderStatusLabels, Order } from '@/features/database/types/index.type';
import { ObjectId } from 'mongodb';
import { recalculateUserEtiquetasForOrderChanges } from '@/features/etiquetas/utils/userTags.util';

export async function updateOrderPayment(
  orderId: string,
  bankAccount: string,
  transferReference: string,
  comment?: string
) {
  const db = await connectToDatabase();
  const orders = db.collection<Order>('orders');

  const currentOrder = await orders.findOne({ _id: new ObjectId(orderId) });
  if (!currentOrder) {
    throw new Error('Order not found');
  }

  const now = new Date();
  const updateData: Record<string, unknown> = {
    'paymentInfo.bankAccount': bankAccount,
    'paymentInfo.transferReference': transferReference,
    updatedAt: now
  };

  const shouldAutoAdvance = currentOrder.status === OrderStatus.WAITING_PAYMENT || currentOrder.status === OrderStatus.PAYMENT_FAILED;
  if (shouldAutoAdvance) {
    updateData.status = OrderStatus.PENDING;
  }

  const updateOperation: Record<string, unknown> = {
    $set: updateData
  };

  if (shouldAutoAdvance) {
    updateOperation.$push = {
      logs: {
        status: OrderStatus.PENDING,
        statusName: OrderStatusLabels[OrderStatus.PENDING],
        createdAt: now,
        comment: comment || 'Estado actualizado automáticamente después de confirmar pago'
      }
    };
  }

  const result = await orders.updateOne(
    { _id: new ObjectId(orderId) },
    updateOperation
  );

  if (result.matchedCount === 0) {
    throw new Error('Order not found');
  }

  // Recalculate user etiquetas after payment update (status may have changed from PAYMENT_FAILED to PENDING)
  if (shouldAutoAdvance && (currentOrder.userId || currentOrder.customerPhone)) {
    try {
      const userId = currentOrder.userId || '';
      const customerPhone = currentOrder.customerPhone || '';
      if (userId || customerPhone) {
        await recalculateUserEtiquetasForOrderChanges(userId, customerPhone);
      }
    } catch (etiquetaError) {
      console.error('Error recalculating etiquetas after payment update:', etiquetaError);
      // Don't fail payment update if etiqueta recalculation fails
    }
  }

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    upsertedCount: result.upsertedCount
  };
}

