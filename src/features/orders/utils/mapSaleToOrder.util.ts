import { Order, OrderStatus, OrderStatusType } from '@/features/database/types/index.type';
import { SaleFromAPI } from '@/features/api/types/api.type';

const FASTAPI_TO_ORDER_STATUS: Record<string, OrderStatusType> = {
  pending: OrderStatus.PENDING,
  cooking: OrderStatus.COOKING,
  ready: OrderStatus.READY,
  completed: OrderStatus.COMPLETED,
  cancelled: OrderStatus.CANCELLED,
};

export const ORDER_STATUS_TO_FASTAPI: Record<number, string> = {
  [OrderStatus.PENDING]: 'pending',
  [OrderStatus.COOKING]: 'cooking',
  [OrderStatus.READY]: 'ready',
  [OrderStatus.COMPLETED]: 'completed',
  [OrderStatus.CANCELLED]: 'cancelled',
};

export function mapSaleToOrder(sale: SaleFromAPI): Order {
  return {
    _id: String(sale.id),
    customerPhone: sale.customer_phone ?? '',
    customerName: sale.customer_name ?? '',
    status: FASTAPI_TO_ORDER_STATUS[sale.status] ?? OrderStatus.PENDING,
    totalPrice: Number(sale.total_amount ?? 0),
    createdAt: sale.created_at ? new Date(sale.created_at) : new Date(),
    updatedAt: sale.updated_at ? new Date(sale.updated_at) : new Date(),
    items: sale.items.map((item) => ({
      burgerId: String(item.product_id ?? 0),
      quantity: Number(item.quantity ?? 1),
      price: Number(item.unit_price ?? 0),
      removedIngredients: [],
    })),
    paymentInfo: {
      bankAccount: '',
      transferReference: '',
    },
  };
}
