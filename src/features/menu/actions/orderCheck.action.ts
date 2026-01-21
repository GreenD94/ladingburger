'use server';

import { getOrdersByPhone } from '@/features/orders/actions/orders.action';
import { OrderStatus } from '@/features/database/types/index.type';

export async function getActiveOrder(phoneNumber: string) {
  try {
    if (!phoneNumber) {
      return null;
    }

    const orders = await getOrdersByPhone(phoneNumber);
    
    if (!orders || orders.length === 0) {
      return null;
    }

    const activeOrder = orders.find(order => 
      order.status !== OrderStatus.COMPLETED && 
      order.status !== OrderStatus.CANCELLED && 
      order.status !== OrderStatus.REFUNDED
    );
    return activeOrder || null;
  } catch (error) {
    console.error('Error getting active order:', error);
    return null;
  }
}

export async function hasActiveOrder(phoneNumber: string): Promise<boolean> {
  try {
    const activeOrder = await getActiveOrder(phoneNumber);
    return activeOrder !== null;
  } catch (error) {
    console.error('Error checking active order:', error);
    return false;
  }
}

