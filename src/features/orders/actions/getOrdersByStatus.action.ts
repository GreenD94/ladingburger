'use server';

import { Order, OrderStatusType } from '@/features/database/types/index.type';
import { SaleFromAPI } from '@/features/api/types/api.type';
import { apiAuthGet } from '@/features/api/utils/apiClient.util';
import { mapSaleToOrder, ORDER_STATUS_TO_FASTAPI } from '../utils/mapSaleToOrder.util';

export interface GetOrdersByStatusResponse {
  success: boolean;
  data?: Order[];
  total: number;
  error?: string;
}

export interface GetOrdersByStatusParams {
  status: OrderStatusType;
  hoursAgo?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
  searchQuery?: string;
}

export async function getOrdersByStatus(params: GetOrdersByStatusParams): Promise<GetOrdersByStatusResponse> {
  try {
    const { status } = params;

    // Statuses with no FastAPI equivalent return empty
    if (!ORDER_STATUS_TO_FASTAPI[status]) {
      return { success: true, data: [], total: 0 };
    }

    const sales = await apiAuthGet<SaleFromAPI[]>('/api/v1/sales');
    const allOrders = sales.map(mapSaleToOrder);
    const filtered = allOrders.filter((o) => o.status === status);

    return { success: true, data: filtered, total: filtered.length };
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return { success: false, error: 'Failed to fetch orders', total: 0 };
  }
}
