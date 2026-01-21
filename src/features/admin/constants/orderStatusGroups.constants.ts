import { OrderStatus, OrderStatusType } from '@/features/database/types/index.type';

/**
 * Active statuses that should always be loaded on mount with 24-hour filter
 */
export const ACTIVE_STATUSES: OrderStatusType[] = [
  OrderStatus.WAITING_PAYMENT,
  OrderStatus.PAYMENT_FAILED,
  OrderStatus.PENDING,
  OrderStatus.COOKING,
  OrderStatus.READY,
];

/**
 * Historical statuses that should be lazy-loaded when user clicks on them
 * These require pagination and search functionality
 */
export const HISTORICAL_STATUSES: OrderStatusType[] = [
  OrderStatus.IN_TRANSIT,
  OrderStatus.WAITING_PICKUP,
  OrderStatus.COMPLETED,
  OrderStatus.ISSUE,
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
];

/**
 * Default hours ago filter for active statuses
 */
export const ACTIVE_STATUS_HOURS_FILTER = 24;

/**
 * Default pagination limit for historical statuses
 */
export const HISTORICAL_STATUS_PAGE_SIZE = 50;

/**
 * Check if a status is active (always loaded)
 */
export function isActiveStatus(status: OrderStatusType): boolean {
  return ACTIVE_STATUSES.includes(status);
}

/**
 * Check if a status is historical (lazy-loaded)
 */
export function isHistoricalStatus(status: OrderStatusType): boolean {
  return HISTORICAL_STATUSES.includes(status);
}

