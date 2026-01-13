import { useMemo } from 'react';
import { Order, OrderStatus, PaymentStatus } from '@/features/database/types';

export interface OrderAlert {
  orderId: string;
  type: 'payment_waiting' | 'cooking_delayed' | 'issue_urgent' | 'new_order';
  message: string;
  severity: 'warning' | 'error' | 'info';
  timestamp: Date;
}

interface AlertThresholds {
  paymentWaitingMinutes: number;
  cookingDelayMinutes: number;
  issueUrgentMinutes: number;
}

const defaultThresholds: AlertThresholds = {
  paymentWaitingMinutes: 10,
  cookingDelayMinutes: 30, // Default estimated prep time if not specified
  issueUrgentMinutes: 30,
};

export function useOrderAlerts(
  orders: Order[],
  thresholds: Partial<AlertThresholds> = {}
): OrderAlert[] {
  const finalThresholds = { ...defaultThresholds, ...thresholds };

  return useMemo(() => {
    const alerts: OrderAlert[] = [];
    const now = new Date();

    orders.forEach((order) => {
      const orderAge = (now.getTime() - new Date(order.createdAt).getTime()) / (1000 * 60); // minutes

      // Alert: Order waiting for payment > threshold
      if (
        order.status === OrderStatus.WAITING_PAYMENT &&
        order.paymentInfo.paymentStatus === PaymentStatus.PENDING &&
        orderAge > finalThresholds.paymentWaitingMinutes
      ) {
        alerts.push({
          orderId: order._id!.toString(),
          type: 'payment_waiting',
          message: `Pedido esperando pago por más de ${finalThresholds.paymentWaitingMinutes} minutos`,
          severity: 'warning',
          timestamp: new Date(order.createdAt),
        });
      }

      // Alert: Order in cooking > estimated time
      if (order.status === OrderStatus.COOKING) {
        const estimatedTime = order.estimatedPrepTime || finalThresholds.cookingDelayMinutes;
        if (orderAge > estimatedTime) {
          alerts.push({
            orderId: order._id!.toString(),
            type: 'cooking_delayed',
            message: `Pedido en cocina por más de ${estimatedTime} minutos`,
            severity: 'warning',
            timestamp: new Date(order.createdAt),
          });
        }
      }

      // Alert: Order with issue > threshold
      if (
        order.status === OrderStatus.ISSUE &&
        orderAge > finalThresholds.issueUrgentMinutes
      ) {
        alerts.push({
          orderId: order._id!.toString(),
          type: 'issue_urgent',
          message: `Problema con pedido sin resolver por más de ${finalThresholds.issueUrgentMinutes} minutos`,
          severity: 'error',
          timestamp: new Date(order.createdAt),
        });
      }
    });

    // Sort by severity (error > warning > info) and then by timestamp
    alerts.sort((a, b) => {
      const severityOrder = { error: 0, warning: 1, info: 2 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return a.timestamp.getTime() - b.timestamp.getTime();
    });

    return alerts;
  }, [orders, finalThresholds]);
}

