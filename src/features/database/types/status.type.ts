export const OrderStatus = {
  WAITING_PAYMENT: 1,
  PAYMENT_FAILED: 2,
  PENDING: 11,
  COOKING: 3,
  READY: 10,
  IN_TRANSIT: 4,
  WAITING_PICKUP: 5,
  COMPLETED: 6,
  ISSUE: 7,
  CANCELLED: 8,
  REFUNDED: 9,
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderStatusLabels: Record<OrderStatusType, string> = {
  [OrderStatus.WAITING_PAYMENT]: 'Esperando Pago',
  [OrderStatus.PAYMENT_FAILED]: 'Pago Fallido',
  [OrderStatus.PENDING]: 'Pendiente',
  [OrderStatus.COOKING]: 'En Cocina',
  [OrderStatus.READY]: 'Listo',
  [OrderStatus.IN_TRANSIT]: 'En Tránsito',
  [OrderStatus.WAITING_PICKUP]: 'Esperando Recogida',
  [OrderStatus.COMPLETED]: 'Completado',
  [OrderStatus.ISSUE]: 'Problema',
  [OrderStatus.CANCELLED]: 'Cancelado',
  [OrderStatus.REFUNDED]: 'Reembolsado',
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

