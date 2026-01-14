'use server';

import { connectToDatabase } from '@/features/database/connection';
import { PaymentStatus, PaymentStatusLabels } from '@/features/database/types/index.type';
import { ObjectId } from 'mongodb';

export async function updateOrderPayment(
  orderId: string,
  bankAccount: string,
  transferReference: string,
  comment?: string
) {
  const db = await connectToDatabase();
  const orders = db.collection('orders');

  const currentOrder = await orders.findOne({ _id: new ObjectId(orderId) });
  if (!currentOrder) {
    throw new Error('Order not found');
  }

  const currentPaymentStatus = currentOrder.paymentInfo.paymentStatus;
  const newPaymentStatus = PaymentStatus.PAID;

  if (currentPaymentStatus !== newPaymentStatus) {
    const paymentLog = {
      status: newPaymentStatus,
      statusName: PaymentStatusLabels[newPaymentStatus],
      createdAt: new Date(),
      comment: comment || ''
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

