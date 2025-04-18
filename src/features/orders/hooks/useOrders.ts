import { useState, useEffect } from 'react';
import { Order } from '@/features/database/types';
import { getOrdersByPhone } from '@/features/database/actions/orders';

interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export const useOrders = (phoneNumber: string | null): UseOrdersResult => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!phoneNumber) {
        setError('No phone number provided');
        setLoading(false);
        return;
      }

      try {
        const fetchedOrders = await getOrdersByPhone(phoneNumber);
        if (!fetchedOrders) {
          throw new Error('Failed to fetch orders');
        }
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
        setError(errorMessage);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [phoneNumber]);

  return { orders, loading, error };
}; 