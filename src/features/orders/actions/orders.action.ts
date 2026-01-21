import { Order, OrderStatus, OrderStatusType, CreateOrderDTO } from '@/features/database/types/index.type';
import { createOrder as createOrderAction } from './createOrder.action';
import { getOrdersByPhone as getOrdersByPhoneAction } from './getOrdersByPhone.action';
import { updateOrderStatus as updateOrderStatusAction } from './updateOrderStatus.action';
import { getOrCreateUser } from '@/features/database/actions/users/getOrCreateUser.action';
import { getAvailableBurgers } from '@/features/menu/actions/menu.action';
import { calculateEstimatedPrepTime } from '../utils/calculateEstimatedPrepTime.util';
import { connectToDatabase } from '@/features/database/connection';
import { ObjectId } from 'mongodb';
import { User } from '@/features/database/types/index.type';

export async function createOrder(order: CreateOrderDTO) {
  const { userId } = await getOrCreateUser(order.customerPhone);

  const db = await connectToDatabase();
  const user = await db.collection<User>('users').findOne({ _id: new ObjectId(userId) });
  const customerName = user?.name || '';

  const availableBurgers = await getAvailableBurgers();
  if (!availableBurgers || availableBurgers.length === 0) {
    throw new Error('Failed to fetch current burger prices');
  }
  const burgerPrices = new Map(availableBurgers.map(burger => [burger._id?.toString() || '', burger.price]));
  const burgersMap = new Map(availableBurgers.map(burger => [burger._id?.toString() || '', burger]));

  const itemsWithPrices = order.items.map(item => ({
    ...item,
    price: burgerPrices.get(item.burgerId) || 0,
    note: item.note || '',
  }));

  const totalPrice = itemsWithPrices.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const estimatedPrepTime = calculateEstimatedPrepTime(itemsWithPrices, burgersMap);

  const orderWithUser: Omit<Order, '_id' | 'createdAt' | 'updatedAt'> = {
    ...order,
    userId,
    customerName: customerName || undefined,
    status: OrderStatus.WAITING_PAYMENT,
    items: itemsWithPrices,
    totalPrice,
    estimatedPrepTime,
    paymentInfo: {
      bankAccount: '',
      transferReference: '',
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

