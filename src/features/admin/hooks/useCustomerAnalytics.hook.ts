import { useState, useEffect } from 'react';
import { Order } from '@/features/database/types/index.type';
import { getOrdersByCustomerPhone, CustomerOrderStats } from '@/features/orders/actions/getOrdersByCustomerPhone.action';
import { EMPTY_USER } from '@/features/database/constants/emptyObjects.constants';
import { FIRST_ORDER_COUNT, VIP_LIFETIME_VALUE_THRESHOLD, VIP_ORDER_COUNT_THRESHOLD, FREQUENT_ORDER_COUNT_THRESHOLD } from '../constants/customerSegments.constants';

export interface CustomerAnalytics {
  orders: Order[];
  stats: CustomerOrderStats;
  loading: boolean;
  error: string;
}

const EMPTY_CUSTOMER_STATS: CustomerOrderStats = {
  totalOrders: 0,
  lifetimeValue: 0,
  averageOrderValue: 0,
  lastOrderDate: new Date(0),
  firstOrderDate: new Date(0),
};

export function useCustomerAnalytics(phoneNumber: string) {
  const [analytics, setAnalytics] = useState<CustomerAnalytics>({
    orders: [],
    stats: EMPTY_CUSTOMER_STATS,
    loading: false,
    error: '',
  });

  useEffect(() => {
    if (!phoneNumber || phoneNumber === '') {
      setAnalytics({
        orders: [],
        stats: EMPTY_CUSTOMER_STATS,
        loading: false,
        error: '',
      });
      return;
    }

    const fetchCustomerData = async () => {
      setAnalytics(prev => ({ ...prev, loading: true, error: '' }));
      try {
        const result = await getOrdersByCustomerPhone(phoneNumber);
        if (result) {
          setAnalytics({
            orders: result.orders,
            stats: result.stats,
            loading: false,
            error: '',
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

  const getCustomerSegment = (): 'new' | 'frequent' | 'vip' => {
    const { totalOrders, lifetimeValue } = analytics.stats;
    
    if (totalOrders === FIRST_ORDER_COUNT) return 'new';
    if (lifetimeValue > VIP_LIFETIME_VALUE_THRESHOLD || totalOrders > VIP_ORDER_COUNT_THRESHOLD) return 'vip';
    if (totalOrders > FREQUENT_ORDER_COUNT_THRESHOLD) return 'frequent';
    return 'new';
  };

  const getOrderFrequency = (): number => {
    const { totalOrders, firstOrderDate, lastOrderDate } = analytics.stats;
    
    if (firstOrderDate.getTime() === 0 || lastOrderDate.getTime() === 0 || totalOrders < 2) return 0;
    
    const monthsDiff = (lastOrderDate.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsDiff > 0 ? totalOrders / monthsDiff : totalOrders;
  };

  return {
    ...analytics,
    customerSegment: getCustomerSegment(),
    orderFrequency: getOrderFrequency(),
    refetch: () => {
      if (phoneNumber && phoneNumber !== '') {
        setAnalytics(prev => ({ ...prev, loading: true }));
      }
    },
  };
}

