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
  [OrderStatus.WAITING_PAYMENT]: 'Esperando Pago',
  [OrderStatus.COOKING]: 'En Cocina',
  [OrderStatus.IN_TRANSIT]: 'En Tránsito',
  [OrderStatus.WAITING_PICKUP]: 'Esperando Recogida',
  [OrderStatus.COMPLETED]: 'Completado',
  [OrderStatus.ISSUE]: 'Problema',
};

export const PaymentStatus = {
  PENDING: 1,
  PAID: 2,
  FAILED: 3,
  REFUNDED: 4,
} as const;

export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentStatusLabels: Record<PaymentStatusType, string> = {
  [PaymentStatus.PENDING]: 'Pendiente',
  [PaymentStatus.PAID]: 'Pagado',
  [PaymentStatus.FAILED]: 'Fallido',
  [PaymentStatus.REFUNDED]: 'Reembolsado',
};

