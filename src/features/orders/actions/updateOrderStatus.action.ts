'use server';

import { OrderStatusType } from '@/features/database/types/index.type';
import { SaleFromAPI } from '@/features/api/types/api.type';
import { apiAuthPut } from '@/features/api/utils/apiClient.util';
import { ORDER_STATUS_TO_FASTAPI } from '../utils/mapSaleToOrder.util';

export async function updateOrderStatus(orderId: string, status: OrderStatusType, _comment?: string, _cancelledBy?: string) {
  try {
    const fastapiStatus = ORDER_STATUS_TO_FASTAPI[status];

    if (!fastapiStatus) {
      return { success: false, error: `Status ${status} is not supported by the backend in Cycle 01` };
    }

    await apiAuthPut<SaleFromAPI>(`/api/v1/sales/${Number(orderId)}/status`, { status: fastapiStatus });

    return { success: true, message: 'Order status updated successfully' };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order status',
    };
  }
}
