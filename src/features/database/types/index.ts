import { ObjectId } from 'mongodb';

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

// Interfaces
export interface OrderItem {
  burgerId: string;
  removedIngredients: string[];
  quantity: number;
  price: number;  // Price at the time of purchase
  note?: string;  // Optional note for the burger
}

export interface PaymentInfo {
  bankAccount: string;
  transferReference: string;
  paymentStatus: PaymentStatusType;
}

export interface Order {
  _id?: ObjectId | string;
  userId: ObjectId | string;
  customerPhone: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatusType;
  createdAt: Date;
  updatedAt: Date;
  paymentInfo: PaymentInfo;
}

export type CreateOrderDTO = Omit<Order, '_id' | 'createdAt' | 'updatedAt' | 'userId'>;

export interface Burger {
  _id?: ObjectId | string;
  name: string;
  description: string;
  price: number;
  ingredients: string[];
  image: string;
  category: string;
  isAvailable: boolean;
}

export * from './status';
export * from './order';
export * from './burger';
export * from './media';
export * from './user'; 