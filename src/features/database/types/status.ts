

// Order Status
export const OrderStatus = {
  WAITING_PAYMENT: 1,
  COOKING: 2,
  IN_TRANSIT: 3,
  WAITING_PICKUP: 4,
  COMPLETED: 5,
  ISSUE: 6,
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderStatusLabels: Record<OrderStatusType, string> = {
  [OrderStatus.WAITING_PAYMENT]: 'Waiting Payment',
  [OrderStatus.COOKING]: 'Cooking',
  [OrderStatus.IN_TRANSIT]: 'In Transit',
  [OrderStatus.WAITING_PICKUP]: 'Waiting Pickup',
  [OrderStatus.COMPLETED]: 'Completed',
  [OrderStatus.ISSUE]: 'Issue',
};

// Payment Status
export const PaymentStatus = {
  PENDING: 1,
  PAID: 2,
  FAILED: 3,
  REFUNDED: 4,
} as const;

export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentStatusLabels: Record<PaymentStatusType, string> = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.FAILED]: 'Failed',
  [PaymentStatus.REFUNDED]: 'Refunded',
}; 