import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/features/database/types/index.type';
import { EMPTY_DATE_RANGE } from '@/features/database/constants/emptyValues.constants';

export interface OrdersAnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<number, number>;
  ordersByHour: Record<number, number>;
  revenueByHour: Record<number, number>;
  topProducts: Array<{ burgerId: string; quantity: number; revenue: number }>;
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
  };
  loading: boolean;
  error: string;
}

export function useOrdersAnalytics(
  orders: Order[],
  dateRange?: { start: Date; end: Date }
): OrdersAnalyticsData {
  const [analytics, setAnalytics] = useState<OrdersAnalyticsData>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    ordersByStatus: {},
    ordersByHour: {},
    revenueByHour: {},
    topProducts: [],
    customerMetrics: {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
    },
    loading: false,
    error: '',
  });

  useEffect(() => {
    if (!orders || orders.length === 0) {
      setAnalytics({
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        ordersByStatus: {},
        ordersByHour: {},
        revenueByHour: {},
        topProducts: [],
        customerMetrics: {
          totalCustomers: 0,
          newCustomers: 0,
          returningCustomers: 0,
        },
        loading: false,
        error: '',
      });
      return;
    }

    try {
      let filteredOrders = orders;
      const effectiveDateRange = dateRange || EMPTY_DATE_RANGE;
      if (effectiveDateRange.start.getTime() !== 0 || effectiveDateRange.end.getTime() !== 0) {
        filteredOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          if (effectiveDateRange.start.getTime() !== 0 && orderDate < effectiveDateRange.start) return false;
          if (effectiveDateRange.end.getTime() !== 0) {
            const endDate = new Date(effectiveDateRange.end);
            endDate.setHours(23, 59, 59, 999);
            if (orderDate > endDate) return false;
          }
          return true;
        });
      }

      const totalOrders = filteredOrders.length;
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const ordersByStatus: Record<number, number> = {};
      Object.values(OrderStatus).forEach((status) => {
        ordersByStatus[status] = filteredOrders.filter((o) => o.status === status).length;
      });

      const ordersByHour: Record<number, number> = {};
      const revenueByHour: Record<number, number> = {};
      filteredOrders.forEach((order) => {
        const hour = new Date(order.createdAt).getHours();
        ordersByHour[hour] = (ordersByHour[hour] || 0) + 1;
        revenueByHour[hour] = (revenueByHour[hour] || 0) + order.totalPrice;
      });

      const productMap = new Map<string, { quantity: number; revenue: number }>();
      filteredOrders.forEach((order) => {
        order.items.forEach((item) => {
          const existing = productMap.get(item.burgerId);
          if (existing) {
            existing.quantity += item.quantity;
            existing.revenue += item.price * item.quantity;
          } else {
            productMap.set(item.burgerId, {
              quantity: item.quantity,
              revenue: item.price * item.quantity,
            });
          }
        });
      });

      const topProducts = Array.from(productMap.entries())
        .map(([burgerId, data]) => ({ burgerId, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      const customerOrders = new Map<string, number>();
      filteredOrders.forEach((order) => {
        const count = customerOrders.get(order.customerPhone) || 0;
        customerOrders.set(order.customerPhone, count + 1);
      });

      const totalCustomers = customerOrders.size;
      const returningCustomers = Array.from(customerOrders.values()).filter((count) => count > 1).length;
      const newCustomers = totalCustomers - returningCustomers;

      setAnalytics({
        totalOrders,
        totalRevenue,
        averageOrderValue,
        ordersByStatus,
        ordersByHour,
        revenueByHour,
        topProducts,
        customerMetrics: {
          totalCustomers,
          newCustomers,
          returningCustomers,
        },
        loading: false,
        error: '',
      });
    } catch (error) {
      console.error('Error calculating analytics:', error);
      setAnalytics((prev) => ({
        ...prev,
        loading: false,
        error: 'Error calculating analytics',
      }));
    }
  }, [orders, dateRange]);

  return analytics;
}

