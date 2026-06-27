'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Order, OrderItem } from '@/features/database/types/order.type';
import { Burger } from '@/features/database/types/burger.type';
import { Material } from '../../types/material.type';
import { ObjectId } from 'mongodb';
import { EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';

export interface OrderCostData {
  totalCost: number;
  calculatedAt: Date;
  burgerCosts: {
    burgerId: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
}

export interface AttachCostDataResponse {
  success: boolean;
  error?: string;
}

export async function attachCostDataToOrder(orderId: string): Promise<AttachCostDataResponse> {
  try {
    const db = await connectToDatabase();
    
    const order = await db.collection<Order>('orders').findOne({
      _id: new ObjectId(orderId),
    });

    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    const burgerCosts: OrderCostData['burgerCosts'] = [];
    let totalCost = 0;

    for (const item of order.items) {
      const burger = await db.collection<Burger>('burgers').findOne({
        _id: new ObjectId(item.burgerId),
      });

      if (burger && burger.recipe) {
        const burgerCost = burger.recipe.currentCost || 0;
        const itemTotalCost = burgerCost * item.quantity;
        totalCost += itemTotalCost;

        const costBreakdown: {
          materialId: string;
          materialName: string;
          quantity: number;
          unitCost: number;
          totalCost: number;
        }[] = [];

        for (const requirement of burger.recipe.materialRequirements) {
          const material = await db.collection<Material>('materials').findOne({
            _id: new ObjectId(requirement.materialId),
          });

          if (material) {
            const materialCost = requirement.quantity * material.averageCost;
            costBreakdown.push({
              materialId: requirement.materialId,
              materialName: material.name,
              quantity: requirement.quantity,
              unitCost: material.averageCost,
              totalCost: materialCost,
            });
          }
        }

        burgerCosts.push({
          burgerId: item.burgerId,
          quantity: item.quantity,
          unitCost: burgerCost,
          totalCost: itemTotalCost,
        });

        const updatedItem: OrderItem = {
          ...item,
          costAtOrder: burgerCost,
          costBreakdown,
        };

        await db.collection<Order>('orders').updateOne(
          { _id: new ObjectId(orderId), 'items.burgerId': item.burgerId },
          { $set: { 'items.$': updatedItem } }
        );
      }
    }

    const costData: OrderCostData = {
      totalCost,
      calculatedAt: new Date(),
      burgerCosts,
    };

    await db.collection<Order>('orders').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { costData, updatedAt: new Date() } }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error attaching cost data to order:', error);
    return {
      success: false,
      error: 'Failed to attach cost data to order',
    };
  }
}

