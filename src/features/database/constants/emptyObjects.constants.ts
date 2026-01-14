import { User } from '../types/user.type';
import { Order, OrderItem, PaymentInfo, PaymentLog } from '../types/order.type';
import { Burger } from '../types/burger.type';
import { BusinessContact } from '../types/businessContact.type';
import { Admin } from '../types/admin.type';
import { DailySales, CustomerAnalyticsSchema, MenuAnalytics, AnalyticsSummary } from '../types/analytics.type';
import { OrderStatus, PaymentStatus } from '../types/status.type';
import { BURGER_IMAGES } from '../types/burger.type';
import type { CustomerAnalytics } from '../models/analytics.model';
import type { TestItem, TestResult } from '../../blackbox/types/index.type';

const EMPTY_DATE = new Date(0);

export const EMPTY_USER: User = {
  phoneNumber: '',
  name: '',
  notes: '',
  tags: [],
  createdAt: EMPTY_DATE,
  updatedAt: EMPTY_DATE,
};

const EMPTY_PAYMENT_LOG: PaymentLog = {
  status: PaymentStatus.PENDING,
  statusName: 'Pendiente',
  createdAt: EMPTY_DATE,
  comment: '',
};

const EMPTY_PAYMENT_INFO: PaymentInfo = {
  bankAccount: '',
  transferReference: '',
  paymentStatus: PaymentStatus.PENDING,
  paymentLogs: [EMPTY_PAYMENT_LOG],
};

const EMPTY_ORDER_ITEM: OrderItem = {
  burgerId: '',
  removedIngredients: [],
  quantity: 0,
  price: 0,
  note: '',
};

export const EMPTY_ORDER: Order = {
  userId: '',
  customerPhone: '',
  items: [],
  totalPrice: 0,
  status: OrderStatus.WAITING_PAYMENT,
  createdAt: EMPTY_DATE,
  updatedAt: EMPTY_DATE,
  paymentInfo: EMPTY_PAYMENT_INFO,
  logs: [],
  priority: 'normal',
  assignedTo: '',
  internalNotes: '',
  estimatedPrepTime: 0,
  actualPrepTime: 0,
  problemCategory: '',
  customerName: '',
};

export const EMPTY_BURGER: Burger = {
  name: '',
  description: '',
  price: 0,
  ingredients: [],
  image: BURGER_IMAGES.CLASSIC,
  category: '',
  isAvailable: false,
};

export const EMPTY_BUSINESS_CONTACT: BusinessContact = {
  whatsappLink: '',
  instagramLink: '',
  venezuelaPayment: {
    phoneNumber: '',
    bankAccount: '',
    documentNumber: '',
  },
  qrCodeUrl: '',
  createdAt: EMPTY_DATE,
  updatedAt: EMPTY_DATE,
};

export const EMPTY_ADMIN: Omit<Admin, '_id' | 'comparePassword'> = {
  email: '',
  password: '',
  createdAt: EMPTY_DATE,
  updatedAt: EMPTY_DATE,
};

export const EMPTY_DAILY_SALES: DailySales = {
  date: EMPTY_DATE,
  totalRevenue: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  itemsSold: [],
  peakHours: [],
};

export const EMPTY_CUSTOMER_ANALYTICS: CustomerAnalyticsSchema = {
  customerPhone: '',
  totalOrders: 0,
  totalSpent: 0,
  firstOrderDate: EMPTY_DATE,
  lastOrderDate: EMPTY_DATE,
  averageOrderValue: 0,
  favoriteItems: [],
};

export const EMPTY_MENU_ANALYTICS: MenuAnalytics = {
  burgerId: '',
  totalSold: 0,
  totalRevenue: 0,
  averageRating: 0,
  customizationStats: [],
  salesByDay: [],
};

export const EMPTY_ANALYTICS_SUMMARY: AnalyticsSummary = {
  period: 'daily',
  startDate: EMPTY_DATE,
  endDate: EMPTY_DATE,
  totalRevenue: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  topSellingItems: [],
  customerMetrics: {
    newCustomers: 0,
    returningCustomers: 0,
    averageOrderFrequency: 0,
  },
};

export const EMPTY_ERROR = new Error('');

export const EMPTY_CUSTOMER_ANALYTICS_TYPE: CustomerAnalytics = {
  totalCustomers: 0,
  newCustomers: 0,
  returningCustomers: 0,
  averageOrderFrequency: 0,
  averageOrderValue: 0,
};

export const EMPTY_TEST_ITEM: TestItem = {
  id: '',
  name: '',
  category: 'orders',
  description: '',
  run: async () => ({ success: false, error: '' }),
};

export const EMPTY_TEST_RESULT: TestResult = {
  success: false,
  error: '',
};

