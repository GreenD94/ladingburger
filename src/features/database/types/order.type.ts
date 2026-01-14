import { ObjectId } from 'mongodb';
import { PaymentStatusType, OrderStatusType } from './status.type';

export interface OrderItem {
  burgerId: string;
  removedIngredients: string[];
  quantity: number;
  price: number;
  note?: string;
}


export interface OrderLog {
  status: OrderStatusType;
  statusName: string;
  createdAt: Date;
  comment?: string;
}

export interface PaymentLog {
  status: PaymentStatusType;
  statusName: string;
  createdAt: Date;
  comment?: string;
}

export interface PaymentInfo {
  bankAccount: string;
  transferReference: string;
  paymentStatus: PaymentStatusType;
  paymentLogs?: PaymentLog[];
}

export interface CreateOrderDTO {
  customerPhone: string;
  items: Omit<OrderItem, 'price'>[];
}

export interface Order {
  _id?: ObjectId | string;
  userId?: string;
  customerPhone: string;
  customerName?: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatusType;
  createdAt: Date;
  updatedAt: Date;
  paymentInfo: PaymentInfo;
  logs?: OrderLog[];
  priority?: 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  internalNotes?: string;
  estimatedPrepTime?: number;
  actualPrepTime?: number;
  problemCategory?: string;
}

