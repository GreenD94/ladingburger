import { Order, OrderStatus, PaymentStatus, OrderStatusType } from '../types/index';
import { createOrder as createOrderAction } from './orders/createOrder';
import { getOrdersByPhone as getOrdersByPhoneAction } from './orders/getOrdersByPhone';
import { updateOrderStatus as updateOrderStatusAction } from './orders/updateOrderStatus';

export async function createOrder(order: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>) {
  const result = await createOrderAction({
    ...order,
    status: OrderStatus.WAITING_PAYMENT,
    paymentInfo: {
      bankAccount: '',
      transferReference: '',
      paymentStatus: PaymentStatus.PENDING
    }
  });
  if (!result.success) {
    throw new Error(result.error || 'Failed to create order');
  }
  return result;
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const orders = await getOrdersByPhoneAction(phone);
  if (!orders) {
    throw new Error('Failed to fetch orders');
  }
  return orders;
}

export async function updateOrderStatus(orderId: string, status: OrderStatusType) {
  const result = await updateOrderStatusAction(orderId, status);
  if (!result.success) {
    throw new Error(result.error || 'Failed to update order status');
  }
  return result;
} 