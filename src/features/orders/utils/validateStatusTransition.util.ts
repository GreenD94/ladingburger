import { OrderStatus, OrderStatusType } from '@/features/database/types/index.type';

const ALLOWED_TRANSITIONS: Record<OrderStatusType, OrderStatusType[]> = {
  [OrderStatus.WAITING_PAYMENT]: [OrderStatus.PENDING, OrderStatus.PAYMENT_FAILED, OrderStatus.CANCELLED, OrderStatus.ISSUE],
  [OrderStatus.PAYMENT_FAILED]: [OrderStatus.WAITING_PAYMENT, OrderStatus.PENDING, OrderStatus.CANCELLED, OrderStatus.ISSUE],
  [OrderStatus.PENDING]: [OrderStatus.COOKING, OrderStatus.CANCELLED, OrderStatus.ISSUE],
  [OrderStatus.COOKING]: [OrderStatus.READY, OrderStatus.ISSUE, OrderStatus.CANCELLED],
  [OrderStatus.READY]: [OrderStatus.IN_TRANSIT, OrderStatus.WAITING_PICKUP, OrderStatus.ISSUE, OrderStatus.CANCELLED],
  [OrderStatus.IN_TRANSIT]: [OrderStatus.COMPLETED, OrderStatus.WAITING_PICKUP, OrderStatus.ISSUE, OrderStatus.CANCELLED],
  [OrderStatus.WAITING_PICKUP]: [OrderStatus.COMPLETED, OrderStatus.IN_TRANSIT, OrderStatus.ISSUE, OrderStatus.CANCELLED],
  [OrderStatus.COMPLETED]: [OrderStatus.REFUNDED],
  [OrderStatus.ISSUE]: [OrderStatus.PENDING, OrderStatus.COOKING, OrderStatus.READY, OrderStatus.IN_TRANSIT, OrderStatus.WAITING_PICKUP, OrderStatus.CANCELLED],
  [OrderStatus.CANCELLED]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: [],
};

export function canTransitionToStatus(currentStatus: OrderStatusType, newStatus: OrderStatusType): boolean {
  if (currentStatus === newStatus) {
    return false;
  }

  const allowedStatuses = ALLOWED_TRANSITIONS[currentStatus];
  return allowedStatuses.includes(newStatus);
}

export function getValidNextStatuses(currentStatus: OrderStatusType): OrderStatusType[] {
  return ALLOWED_TRANSITIONS[currentStatus] || [];
}

