'use server';

import { connectToDatabase } from '@/features/database/connection';
import { MaterialLoss, MaterialLossCause } from '../types/loss.type';
import { ObjectId } from 'mongodb';
import { updateMaterialStock } from '../materials/updateMaterialStock.action';

export interface CreateMaterialLossInput {
  materialId: string;
  quantity: number;
  unit: string;
  lossDate: Date;
  cause: MaterialLossCause;
  notes?: string;
  billId?: string;
}

export interface RecordMaterialLossResponse {
  success: boolean;
  data?: MaterialLoss;
  error?: string;
}

export async function recordMaterialLoss(
  input: CreateMaterialLossInput,
  recordedBy: string
): Promise<RecordMaterialLossResponse> {
  try {
    const db = await connectToDatabase();
    const now = new Date();

    const newLoss: MaterialLoss = {
      materialId: input.materialId,
      quantity: input.quantity,
      unit: input.unit,
      lossDate: input.lossDate,
      cause: input.cause,
      notes: input.notes,
      billId: input.billId,
      recordedBy,
      createdAt: now,
    };

    const result = await db.collection<MaterialLoss>('materialLosses').insertOne(newLoss);

    await updateMaterialStock(input.materialId, -input.quantity);

    return {
      success: true,
      data: {
        ...newLoss,
        _id: result.insertedId.toString(),
      },
    };
  } catch (error) {
    console.error('Error recording material loss:', error);
    return {
      success: false,
      error: 'Failed to record material loss',
    };
  }
}

