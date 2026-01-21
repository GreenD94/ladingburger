'use server'

import clientPromise from '@/features/database/config/mongodb';
import { Order,  OrderStatusLabels } from '@/features/database/types/index.type';
import { getNextOrderNumber } from '../utils/getNextOrderNumber.util';
import { handleNuevoOnOrderCreated, recalculateUserEtiquetasForOrderChanges } from '@/features/etiquetas/utils/userTags.util';

type OrderWithUser = Omit<Order, '_id' | 'createdAt' | 'updatedAt'>;

export async function createOrder(order: OrderWithUser) {
  'use server'
  try {
    const client = await clientPromise;
    const db = client.db('saborea');

    const orderNumber = await getNextOrderNumber();
    const now = new Date();
    const newOrder: Order = {
      ...order,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      logs: [{
        status: order.status,
        statusName: OrderStatusLabels[order.status],
        createdAt: now,
        comment: ''
      }]
    };

    const result = await db.collection<Order>('orders').insertOne(newOrder);
    
    // Handle etiquetas after order creation
    if (order.userId) {
      try {
        // Remove "Nuevo" tag if order is created on a different day than user creation
        await handleNuevoOnOrderCreated(order.userId, now);
        // Recalculate all user etiquetas based on order history
        await recalculateUserEtiquetasForOrderChanges(order.userId, order.customerPhone);
      } catch (etiquetaError) {
        console.error('Error handling etiquetas for order creation:', etiquetaError);
        // Don't fail order creation if etiqueta handling fails
      }
    }
    
    return {
      success: true,
      orderId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: 'Failed to create order',
    };
  }
}

