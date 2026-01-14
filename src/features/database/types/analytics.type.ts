import { ObjectId } from 'mongodb';

export interface DailySales {
  _id?: ObjectId | string;
  date: Date;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  itemsSold: {
    burgerId: string;
    quantity: number;
    revenue: number;
  }[];
  peakHours: {
    hour: number;
    orders: number;
  }[];
}

export interface CustomerAnalyticsSchema {
  _id?: ObjectId | string;
  customerPhone: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: Date;
  lastOrderDate: Date;
  averageOrderValue: number;
  favoriteItems: {
    burgerId: string;
    count: number;
  }[];
}

export interface MenuAnalytics {
  _id?: ObjectId | string;
  burgerId: string;
  totalSold: number;
  totalRevenue: number;
  averageRating?: number;
  customizationStats: {
    removedIngredients: string[];
    count: number;
  }[];
  salesByDay: {
    date: Date;
    quantity: number;
    revenue: number;
  }[];
}

export interface AnalyticsSummary {
  _id?: ObjectId | string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingItems: {
    burgerId: string;
    quantity: number;
    revenue: number;
  }[];
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    averageOrderFrequency: number;
  };
}

