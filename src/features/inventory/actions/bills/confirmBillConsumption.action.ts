'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Bill } from '@/features/inventory/types/index.type';
import { ObjectId } from 'mongodb';

export interface ConfirmBillConsumptionResponse {
  success: boolean;
  error?: string;
}

export async function confirmBillConsumption(
  billId: string,
  confirmedBy: string
): Promise<ConfirmBillConsumptionResponse> {
  try {
    const db = await connectToDatabase();
    const billsCollection = db.collection<Bill>('bills');

    const now = new Date();
    const result = await billsCollection.updateOne(
      { _id: new ObjectId(billId) },
      {
        $set: {
          status: 'consumed',
          confirmedBy,
          confirmedAt: now,
          updatedAt: now,
        },
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Bill not found' };
    }

    return { success: true };
  } catch (error) {
    console.error(`Error confirming bill consumption for ${billId}:`, error);
    return { success: false, error: 'Failed to confirm bill consumption' };
  }
}
