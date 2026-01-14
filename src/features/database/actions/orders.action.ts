import { Order, OrderStatus, PaymentStatus, OrderStatusType, CreateOrderDTO, PaymentStatusLabels } from '../types/index.type';
import { createOrder as createOrderAction } from '@/features/orders/actions/createOrder.action';
import { getOrdersByPhone as getOrdersByPhoneAction } from '@/features/orders/actions/getOrdersByPhone.action';
import { updateOrderStatus as updateOrderStatusAction } from '@/features/orders/actions/updateOrderStatus.action';
import { getOrCreateUser } from './users/getOrCreateUser.action';
import { getAvailableBurgers } from '@/features/menu/actions/menu.action';

export async function createOrder(order: CreateOrderDTO) {
  const { userId } = await getOrCreateUser(order.customerPhone);

  const availableBurgers = await getAvailableBurgers();
  if (!availableBurgers || availableBurgers.length === 0) {
    throw new Error('Failed to fetch current burger prices');
  }
  const burgerPrices = new Map(availableBurgers.map(burger => [burger._id?.toString() || '', burger.price]));

  const itemsWithPrices = order.items.map(item => ({
    ...item,
    price: burgerPrices.get(item.burgerId) || 0,
    note: item.note || '',
  }));

  const totalPrice = itemsWithPrices.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const orderWithUser: Omit<Order, '_id' | 'createdAt' | 'updatedAt'> = {
    ...order,
    userId,
    status: OrderStatus.WAITING_PAYMENT,
    items: itemsWithPrices,
    totalPrice,
    paymentInfo: {
      bankAccount: '',
      transferReference: '',
      paymentStatus: PaymentStatus.PENDING,
      paymentLogs: [{
        status: PaymentStatus.PENDING,
        statusName: PaymentStatusLabels[PaymentStatus.PENDING],
        createdAt: new Date()
      }]
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
  if (!orders || orders.length === 0) {
    return [];
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

