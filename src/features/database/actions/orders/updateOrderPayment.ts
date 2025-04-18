'use server';

import { connectToDatabase } from '@/features/database/connection';
import { PaymentStatus, PaymentStatusLabels } from '@/features/database/types';
import { ObjectId } from 'mongodb';

export async function updateOrderPayment(
  orderId: string,
  bankAccount: string,
  transferReference: string,
  comment?: string
) {
  const db = await connectToDatabase();
  const orders = db.collection('orders');

  // First, get the current order to check its payment status
  const currentOrder = await orders.findOne({ _id: new ObjectId(orderId) });
  if (!currentOrder) {
    throw new Error('Order not found');
  }

  const currentPaymentStatus = currentOrder.paymentInfo.paymentStatus;
  const newPaymentStatus = PaymentStatus.PAID;

  // Only proceed if the status is actually changing
  if (currentPaymentStatus !== newPaymentStatus) {
    const paymentLog = {
      status: newPaymentStatus,
      statusName: PaymentStatusLabels[newPaymentStatus],
      createdAt: new Date(),
      comment: comment || undefined
    };

    const result = await orders.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          'paymentInfo.bankAccount': bankAccount,
          'paymentInfo.transferReference': transferReference,
          'paymentInfo.paymentStatus': newPaymentStatus,
          updatedAt: new Date()
        },
        $addToSet: {
          'paymentInfo.paymentLogs': paymentLog
        }
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('Order not found');
    }

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    };
  }

  // If status is not changing, just update the payment info
  const result = await orders.updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        'paymentInfo.bankAccount': bankAccount,
        'paymentInfo.transferReference': transferReference,
        updatedAt: new Date()
      }
    }
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    upsertedCount: result.upsertedCount
  };
} 