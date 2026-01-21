'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { Order, OrderStatus } from '@/features/database/types/index.type';
import { WithId, Document, ObjectId } from 'mongodb';
import { EMPTY_STRING, EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';

export interface UserDetailedStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  failedPaymentOrders: number;
  lifetimeValue: number;
  averageOrderValue: number;
  totalRevenue: number;
  totalRefunds: number;
  paymentSuccessRate: number;
  cancellationRate: number;
  refundRate: number;
  daysSinceLastOrder: number;
  daysSinceFirstOrder: number;
  orderFrequency: number;
  ordersByMonth: Array<{ month: string; count: number; revenue: number }>;
  ordersByDayOfWeek: Array<{ day: string; count: number }>;
  ordersByHour: Array<{ hour: number; count: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  averageOrderValueByMonth: Array<{ month: string; value: number }>;
  orderStatusDistribution: Array<{ status: number; count: number; label: string }>;
  topProducts: Array<{ burgerId: string; quantity: number; revenue: number }>;
  churnRisk: 'low' | 'medium' | 'high';
  projectedAnnualValue: number;
  firstOrderDate: Date;
  lastOrderDate: Date;
}

interface OrderDocument extends WithId<Document> {
  customerPhone: string;
  totalPrice: number;
  status: number;
  createdAt: Date;
  items: Array<{
    burgerId: string;
    quantity: number;
    price: number;
  }>;
  [key: string]: unknown;
}

export async function getUserDetailedStatsAction(phoneNumber: string): Promise<{
  success: boolean;
  data?: UserDetailedStats;
  error?: string;
}> {
  try {
    const { db } = await connectToDatabase();

    const ordersDocs = await db.collection('orders')
      .find({ customerPhone: phoneNumber })
      .sort({ createdAt: -1 })
      .toArray();

    if (ordersDocs.length === 0) {
      return {
        success: true,
        data: {
          totalOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          refundedOrders: 0,
          failedPaymentOrders: 0,
          lifetimeValue: 0,
          averageOrderValue: 0,
          totalRevenue: 0,
          totalRefunds: 0,
          paymentSuccessRate: 0,
          cancellationRate: 0,
          refundRate: 0,
          daysSinceLastOrder: 0,
          daysSinceFirstOrder: 0,
          orderFrequency: 0,
          ordersByMonth: [],
          ordersByDayOfWeek: [],
          ordersByHour: [],
          revenueByMonth: [],
          averageOrderValueByMonth: [],
          orderStatusDistribution: [],
          topProducts: [],
          churnRisk: 'high',
          projectedAnnualValue: 0,
          firstOrderDate: EMPTY_DATE,
          lastOrderDate: EMPTY_DATE,
        },
      };
    }

    const orders = ordersDocs.map((doc) => {
      const orderDoc = doc as unknown as OrderDocument;
      return {
        ...orderDoc,
        _id: orderDoc._id.toString(),
        createdAt: new Date(orderDoc.createdAt),
      };
    }) as Order[];

    const completedOrders = orders.filter(order => order.status === OrderStatus.COMPLETED);
    const cancelledOrders = orders.filter(order => order.status === OrderStatus.CANCELLED);
    const refundedOrders = orders.filter(order => order.status === OrderStatus.REFUNDED);
    const failedPaymentOrders = orders.filter(order => order.status === OrderStatus.PAYMENT_FAILED);

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalRefunds = refundedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    const paymentSuccessRate = orders.length > 0
      ? ((orders.length - failedPaymentOrders.length) / orders.length) * 100
      : 0;

    const cancellationRate = orders.length > 0
      ? (cancelledOrders.length / orders.length) * 100
      : 0;

    const refundRate = orders.length > 0
      ? (refundedOrders.length / orders.length) * 100
      : 0;

    const orderDates = orders.map(order => new Date(order.createdAt)).sort((a, b) => a.getTime() - b.getTime());
    const firstOrderDate = orderDates.length > 0 ? orderDates[0] : EMPTY_DATE;
    const lastOrderDate = orderDates.length > 0 ? orderDates[orderDates.length - 1] : EMPTY_DATE;

    const now = new Date();
    const daysSinceLastOrder = lastOrderDate !== EMPTY_DATE
      ? Math.floor((now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const daysSinceFirstOrder = firstOrderDate !== EMPTY_DATE
      ? Math.floor((now.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const orderFrequency = daysSinceFirstOrder > 0 && completedOrders.length > 0
      ? (completedOrders.length / daysSinceFirstOrder) * 30
      : 0;

    const ordersByMonthMap = new Map<string, { count: number; revenue: number }>();
    const revenueByMonthMap = new Map<string, number>();
    const averageOrderValueByMonthMap = new Map<string, { total: number; count: number }>();

    completedOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

      const current = ordersByMonthMap.get(monthKey) || { count: 0, revenue: 0 };
      ordersByMonthMap.set(monthKey, {
        count: current.count + 1,
        revenue: current.revenue + order.totalPrice,
      });

      const currentRevenue = revenueByMonthMap.get(monthKey) || 0;
      revenueByMonthMap.set(monthKey, currentRevenue + order.totalPrice);

      const currentAvg = averageOrderValueByMonthMap.get(monthKey) || { total: 0, count: 0 };
      averageOrderValueByMonthMap.set(monthKey, {
        total: currentAvg.total + order.totalPrice,
        count: currentAvg.count + 1,
      });
    });

    const ordersByMonth = Array.from(ordersByMonthMap.entries())
      .map(([key, value]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
        return {
          month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
          count: value.count,
          revenue: value.revenue,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });

    const revenueByMonth = Array.from(revenueByMonthMap.entries())
      .map(([key, revenue]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
        return {
          month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
          revenue,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });

    const averageOrderValueByMonth = Array.from(averageOrderValueByMonthMap.entries())
      .map(([key, value]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
        return {
          month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
          value: value.count > 0 ? value.total / value.count : 0,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });

    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const ordersByDayOfWeekMap = new Map<number, number>();
    completedOrders.forEach(order => {
      const dayOfWeek = new Date(order.createdAt).getDay();
      const current = ordersByDayOfWeekMap.get(dayOfWeek) || 0;
      ordersByDayOfWeekMap.set(dayOfWeek, current + 1);
    });

    const ordersByDayOfWeek = Array.from(ordersByDayOfWeekMap.entries())
      .map(([day, count]) => ({
        day: dayNames[day],
        count,
      }))
      .sort((a, b) => {
        const dayA = dayNames.indexOf(a.day);
        const dayB = dayNames.indexOf(b.day);
        return dayA - dayB;
      });

    const ordersByHourMap = new Map<number, number>();
    completedOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      const current = ordersByHourMap.get(hour) || 0;
      ordersByHourMap.set(hour, current + 1);
    });

    const ordersByHour = Array.from(ordersByHourMap.entries())
      .map(([hour, count]) => ({
        hour,
        count,
      }))
      .sort((a, b) => a.hour - b.hour);

    const statusDistributionMap = new Map<number, number>();
    orders.forEach(order => {
      const current = statusDistributionMap.get(order.status) || 0;
      statusDistributionMap.set(order.status, current + 1);
    });

    const orderStatusDistribution = Array.from(statusDistributionMap.entries())
      .map(([status, count]) => ({
        status,
        count,
        label: status === OrderStatus.COMPLETED ? 'Completado' :
               status === OrderStatus.CANCELLED ? 'Cancelado' :
               status === OrderStatus.REFUNDED ? 'Reembolsado' :
               status === OrderStatus.PAYMENT_FAILED ? 'Pago Fallido' :
               status === OrderStatus.COOKING ? 'En Cocina' :
               status === OrderStatus.IN_TRANSIT ? 'En Tránsito' :
               status === OrderStatus.WAITING_PICKUP ? 'Esperando Recogida' :
               status === OrderStatus.WAITING_PAYMENT ? 'Esperando Pago' :
               status === OrderStatus.ISSUE ? 'Problema' : 'Desconocido',
      }))
      .sort((a, b) => b.count - a.count);

    const productMap = new Map<string, { quantity: number; revenue: number }>();
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        const current = productMap.get(item.burgerId) || { quantity: 0, revenue: 0 };
        productMap.set(item.burgerId, {
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + (item.price * item.quantity),
        });
      });
    });

    const topProducts = Array.from(productMap.entries())
      .map(([burgerId, data]) => ({
        burgerId,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    let churnRisk: 'low' | 'medium' | 'high' = 'high';
    if (daysSinceLastOrder <= 30) {
      churnRisk = 'low';
    } else if (daysSinceLastOrder <= 90) {
      churnRisk = 'medium';
    }

    const projectedAnnualValue = orderFrequency > 0
      ? (orderFrequency / 30) * averageOrderValue * 365
      : 0;

    return {
      success: true,
      data: {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        cancelledOrders: cancelledOrders.length,
        refundedOrders: refundedOrders.length,
        failedPaymentOrders: failedPaymentOrders.length,
        lifetimeValue: totalRevenue,
        averageOrderValue,
        totalRevenue,
        totalRefunds,
        paymentSuccessRate,
        cancellationRate,
        refundRate,
        daysSinceLastOrder,
        daysSinceFirstOrder,
        orderFrequency,
        ordersByMonth,
        ordersByDayOfWeek,
        ordersByHour,
        revenueByMonth,
        averageOrderValueByMonth,
        orderStatusDistribution,
        topProducts,
        churnRisk,
        projectedAnnualValue,
        firstOrderDate,
        lastOrderDate,
      },
    };
  } catch (error) {
    console.error('Error fetching user detailed stats:', error);
    return {
      success: false,
      error: 'Error al cargar las estadísticas',
    };
  }
}

