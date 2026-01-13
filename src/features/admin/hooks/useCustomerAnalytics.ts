import { useState, useEffect } from 'react';
import { Order } from '@/features/database/types';
import { getOrdersByCustomerPhone, CustomerOrderStats } from '@/features/database/actions/orders/getOrdersByCustomerPhone';

export interface CustomerAnalytics {
  orders: Order[];
  stats: CustomerOrderStats;
  loading: boolean;
  error: string | null;
}

export function useCustomerAnalytics(phoneNumber: string | null) {
  const [analytics, setAnalytics] = useState<CustomerAnalytics>({
    orders: [],
    stats: {
      totalOrders: 0,
      lifetimeValue: 0,
      averageOrderValue: 0,
      lastOrderDate: null,
      firstOrderDate: null,
    },
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!phoneNumber) {
      setAnalytics({
        orders: [],
        stats: {
          totalOrders: 0,
          lifetimeValue: 0,
          averageOrderValue: 0,
          lastOrderDate: null,
          firstOrderDate: null,
        },
        loading: false,
        error: null,
      });
      return;
    }

    const fetchCustomerData = async () => {
      setAnalytics(prev => ({ ...prev, loading: true, error: null }));
      try {
        const result = await getOrdersByCustomerPhone(phoneNumber);
        if (result) {
          setAnalytics({
            orders: result.orders,
            stats: result.stats,
            loading: false,
            error: null,
          });
        } else {
          setAnalytics(prev => ({
            ...prev,
            loading: false,
            error: 'No se pudieron cargar los datos del cliente',
          }));
        }
      } catch (error) {
        console.error('Error fetching customer analytics:', error);
        setAnalytics(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar los datos del cliente',
        }));
      }
    };

    fetchCustomerData();
  }, [phoneNumber]);

  // Determine customer segment
  const getCustomerSegment = (): 'new' | 'frequent' | 'vip' => {
    const { totalOrders, lifetimeValue } = analytics.stats;
    
    if (totalOrders === 1) return 'new';
    if (lifetimeValue > 100 || totalOrders > 5) return 'vip';
    if (totalOrders > 2) return 'frequent';
    return 'new';
  };

  // Calculate order frequency (orders per month)
  const getOrderFrequency = (): number => {
    const { totalOrders, firstOrderDate, lastOrderDate } = analytics.stats;
    
    if (!firstOrderDate || !lastOrderDate || totalOrders < 2) return 0;
    
    const monthsDiff = (lastOrderDate.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsDiff > 0 ? totalOrders / monthsDiff : totalOrders;
  };

  return {
    ...analytics,
    customerSegment: getCustomerSegment(),
    orderFrequency: getOrderFrequency(),
    refetch: () => {
      if (phoneNumber) {
        // Trigger re-fetch by updating phoneNumber dependency
        setAnalytics(prev => ({ ...prev, loading: true }));
      }
    },
  };
}

