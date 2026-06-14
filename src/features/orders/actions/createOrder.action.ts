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
    
    const orderId = result.insertedId.toString();
    
    try {
      const { attachCostDataToOrder } = await import('@/features/inventory/actions/orders/attachCostDataToOrder.action');
      await attachCostDataToOrder(orderId);
    } catch (costError) {
      console.error('Error attaching cost data to order:', costError);
    }
    
    if (order.userId) {
      try {
        await handleNuevoOnOrderCreated(order.userId, now);
        await recalculateUserEtiquetasForOrderChanges(order.userId, order.customerPhone);
      } catch (etiquetaError) {
        console.error('Error handling etiquetas for order creation:', etiquetaError);
      }
    }
    
    return {
      success: true,
      orderId,
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: 'Failed to create order',
    };
  }
}

