import { ObjectId } from 'mongodb';
import { PaymentStatusType, OrderStatusType } from './status';

export interface OrderItem {
  burgerId: string;
  removedIngredients: string[];
  quantity: number;
}

export interface PaymentInfo {
  bankAccount: string;
  transferReference: string;
  paymentStatus: PaymentStatusType;
}

export interface Order {
  _id?: ObjectId | string;
  customerPhone: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatusType;
  createdAt: Date;
  updatedAt: Date;
  paymentInfo: PaymentInfo;
} 