'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Bill, BillItem, Material } from '../types/index.type';
import { ObjectId } from 'mongodb';
import { calculateWAC } from '../materials/calculateWAC.action';
import { updateMaterialStock } from '../materials/updateMaterialStock.action';
import { recalculateBurgerCostsForMaterial } from '../recipes/recalculateBurgerCostsForMaterial.action';

export interface RegisterBillInput {
  billNumber: string;
  supplier: string;
  purchaseDate: Date;
  items: Omit<BillItem, 'totalCost'>[];
}

export interface RegisterBillResponse {
  success: boolean;
  data?: Bill;
  error?: string;
}

export async function registerBill(input: RegisterBillInput): Promise<RegisterBillResponse> {
  try {
    const db = await connectToDatabase();
    const now = new Date();

    const billItems: BillItem[] = input.items.map(item => ({
      ...item,
      totalCost: item.quantity * item.unitCost,
    }));

    const totalAmount = billItems.reduce((sum, item) => sum + item.totalCost, 0);

    const newBill: Bill = {
      billNumber: input.billNumber.trim(),
      supplier: input.supplier.trim(),
      purchaseDate: input.purchaseDate,
      totalAmount,
      items: billItems,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection<Bill>('bills').insertOne(newBill);

    const materialIds = new Set<string>();
    billItems.forEach(item => materialIds.add(item.materialId));

    for (const materialId of materialIds) {
      const billItemsForMaterial = billItems.filter(item => item.materialId === materialId);
      const totalQuantity = billItemsForMaterial.reduce((sum, item) => sum + item.quantity, 0);
      const purchaseValue = billItemsForMaterial.reduce(
        (sum, item) => sum + item.totalCost,
        0
      );

      const material = await db.collection<Material>('materials').findOne({
        _id: new ObjectId(materialId),
      });

      if (material) {
        const currentStockBeforePurchase = material.currentStock;
        const currentTotalValue = currentStockBeforePurchase * material.averageCost;
        const newTotalStock = currentStockBeforePurchase + totalQuantity;
        const newAverageCost = newTotalStock > 0
          ? (currentTotalValue + purchaseValue) / newTotalStock
          : 0;

        await db.collection<Material>('materials').updateOne(
          { _id: new ObjectId(materialId) },
          {
            $inc: { currentStock: totalQuantity },
            $set: {
              averageCost: newAverageCost,
              lastPurchaseDate: input.purchaseDate,
              lastPurchasePrice: billItemsForMaterial[0]?.unitCost || 0,
              lastCalculatedAt: now,
              updatedAt: now,
            },
          }
        );

        await recalculateBurgerCostsForMaterial(materialId);
      }
    }

    return {
      success: true,
      data: {
        ...newBill,
        _id: result.insertedId.toString(),
      },
    };
  } catch (error) {
    console.error('Error registering bill:', error);
    return {
      success: false,
      error: 'Failed to register bill',
    };
  }
}

