'use server';

import { connectToDatabase } from '@/features/database/connection';
import { Order } from '@/features/database/types/order.type';
import { Burger } from '@/features/database/types/burger.type';
import { Material } from '../types/material.type';
import { ObjectId } from 'mongodb';
import { updateMaterialStock } from '../materials/updateMaterialStock.action';

export interface ConsumeMaterialsResponse {
  success: boolean;
  error?: string;
}

export async function consumeMaterialsFromOrder(orderId: string): Promise<ConsumeMaterialsResponse> {
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

    for (const item of order.items) {
      const burger = await db.collection<Burger>('burgers').findOne({
        _id: new ObjectId(item.burgerId),
      });

      if (burger && burger.recipe) {
        for (const requirement of burger.recipe.materialRequirements) {
          const consumption = requirement.quantity * item.quantity;
          await updateMaterialStock(requirement.materialId, -consumption);
        }
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error consuming materials from order:', error);
    return {
      success: false,
      error: 'Failed to consume materials from order',
    };
  }
}

