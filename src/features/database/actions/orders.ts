import { Order, OrderStatus, PaymentStatus, OrderStatusType, CreateOrderDTO } from '../types';
import { createOrder as createOrderAction } from './orders/createOrder';
import { getOrdersByPhone as getOrdersByPhoneAction } from './orders/getOrdersByPhone';
import { updateOrderStatus as updateOrderStatusAction } from './orders/updateOrderStatus';
import { getOrCreateUser } from './users/getOrCreateUser';
import { getAvailableBurgers } from './menu';

export async function createOrder(order: CreateOrderDTO) {
  // First, get or create the user
  const { userId } = await getOrCreateUser(order.customerPhone);

  // Get current burger prices
  const availableBurgers = await getAvailableBurgers();
  if (!availableBurgers) {
    throw new Error('Failed to fetch current burger prices');
  }
  const burgerPrices = new Map(availableBurgers.map(burger => [burger._id!.toString(), burger.price]));

  // Create the order with the user reference and current prices
  const orderWithUser: Omit<Order, '_id' | 'createdAt' | 'updatedAt'> = {
    ...order,
    userId,
    status: OrderStatus.WAITING_PAYMENT,
    items: order.items.map(item => ({
      ...item,
      price: burgerPrices.get(item.burgerId) || 0, // Use current price or 0 if not found
      note: item.note || '', // Include note if provided
    })),
    paymentInfo: {
      bankAccount: '',
      transferReference: '',
      paymentStatus: PaymentStatus.PENDING
    }
  };

  const result = await createOrderAction(orderWithUser);
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