import { useState, useEffect } from 'react';
import { Order, OrderStatus, OrderStatusType } from '@/features/database/types/index.type';
import { getOrdersByStatus } from '@/features/orders/actions/getOrdersByStatus.action';

export function useOrders() {
  const [orders, setOrders] = useState<Record<OrderStatusType, Order[]>>({
    [OrderStatus.WAITING_PAYMENT]: [],
    [OrderStatus.COOKING]: [],
    [OrderStatus.IN_TRANSIT]: [],
    [OrderStatus.WAITING_PICKUP]: [],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.ISSUE]: []
  });
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await Promise.all(
        Object.values(OrderStatus).map(async (status) => {
          const response = await getOrdersByStatus(status);
          return { status, orders: response.data || [] };
        })
      );

      const ordersByStatus = allOrders.reduce((acc, { status, orders }) => {
        acc[status] = orders;
        return acc;
      }, {} as Record<OrderStatusType, Order[]>);

      setOrders(ordersByStatus);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    refetchOrders: fetchOrders
  };
}

