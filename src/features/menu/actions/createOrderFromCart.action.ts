'use server';

import { createOrder } from '@/features/orders/actions/orders.action';
import { CreateOrderDTO } from '@/features/database/types/index.type';
import { CartItem } from '../contexts/CartContext.context';

interface CreateOrderFromCartParams {
  items: CartItem[];
  phoneNumber: string;
  comment?: string;
}

export async function createOrderFromCart({
  items,
  phoneNumber,
  comment,
}: CreateOrderFromCartParams): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    if (!phoneNumber || phoneNumber.length !== 11) {
      return {
        success: false,
        error: 'Invalid phone number',
      };
    }

    if (!items || items.length === 0) {
      return {
        success: false,
        error: 'Cart is empty',
      };
    }

    const orderItems = items.map((item) => ({
      burgerId: item.burger._id?.toString() || '',
      removedIngredients: item.removedIngredients || [],
      quantity: item.quantity,
      note: comment || item.note || '',
    }));

    const orderDTO: CreateOrderDTO = {
      customerPhone: phoneNumber,
      items: orderItems,
    };

    const result = await createOrder(orderDTO);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to create order',
      };
    }

    return {
      success: true,
      orderId: result.orderId,
    };
  } catch (error) {
    console.error('Error creating order from cart:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    };
  }
}

