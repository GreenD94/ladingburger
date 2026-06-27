'use server';

import { apiPost } from '@/features/api/utils/apiClient.util';
import { SaleFromAPI } from '@/features/api/types/api.type';
import { CartItem } from '../contexts/CartContext.context';

interface CreateOrderFromCartParams {
  items: CartItem[];
  phoneNumber: string;
  comment?: string;
}

export async function createOrderFromCart({
  items,
  phoneNumber,
}: CreateOrderFromCartParams): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    if (!phoneNumber || phoneNumber.length !== 11) {
      return { success: false, error: 'Invalid phone number' };
    }

    if (!items || items.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    const sale = await apiPost<SaleFromAPI>('/api/v1/sales', {
      customer_phone: phoneNumber,
      store_id: 1,
      items: items.map((item) => ({
        product_id: Number(item.burger._id),
        quantity: item.quantity,
        unit_price: Number(item.burger.price),
      })),
    });

    return { success: true, orderId: String(sale.id) };
  } catch (error) {
    console.error('Error creating order from cart:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    };
  }
}
