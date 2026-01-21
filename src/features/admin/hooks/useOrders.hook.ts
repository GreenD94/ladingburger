import { useState, useEffect, useCallback, useRef } from 'react';
import { Order, OrderStatus, OrderStatusType } from '@/features/database/types/index.type';
import { getOrdersByStatus } from '@/features/orders/actions/getOrdersByStatus.action';
import {
  ACTIVE_STATUSES,
  ACTIVE_STATUS_HOURS_FILTER,
  HISTORICAL_STATUS_PAGE_SIZE,
  isActiveStatus,
} from '@/features/admin/constants/orderStatusGroups.constants';
import { NOT_LOADED } from '@/features/database/constants/emptyValues.constants';
import { logError } from '@/features/menu/utils/logError.util';

export interface UseOrdersReturn {
  orders: Record<OrderStatusType, Order[]>;
  loading: boolean;
  loadingStatuses: Set<OrderStatusType>;
  loadedStatuses: Set<OrderStatusType>;
  totals: Record<OrderStatusType, number>; // NOT_LOADED (-1) means not loaded yet
  refetchActiveOrders: () => Promise<void>;
  loadStatus: (
    status: OrderStatusType,
    options?: {
      page?: number;
      searchQuery?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) => Promise<void>;
  refetchStatus: (status: OrderStatusType) => Promise<void>;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Record<OrderStatusType, Order[]>>({
    [OrderStatus.WAITING_PAYMENT]: [],
    [OrderStatus.PAYMENT_FAILED]: [],
    [OrderStatus.COOKING]: [],
    [OrderStatus.READY]: [],
    [OrderStatus.IN_TRANSIT]: [],
    [OrderStatus.WAITING_PICKUP]: [],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.ISSUE]: [],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.REFUNDED]: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadingStatuses, setLoadingStatuses] = useState<Set<OrderStatusType>>(new Set());
  const [loadedStatuses, setLoadedStatuses] = useState<Set<OrderStatusType>>(new Set());
  const [totals, setTotals] = useState<Record<OrderStatusType, number>>({
    [OrderStatus.WAITING_PAYMENT]: NOT_LOADED,
    [OrderStatus.PAYMENT_FAILED]: NOT_LOADED,
    [OrderStatus.COOKING]: NOT_LOADED,
    [OrderStatus.READY]: NOT_LOADED,
    [OrderStatus.IN_TRANSIT]: NOT_LOADED,
    [OrderStatus.WAITING_PICKUP]: NOT_LOADED,
    [OrderStatus.COMPLETED]: NOT_LOADED,
    [OrderStatus.ISSUE]: NOT_LOADED,
    [OrderStatus.CANCELLED]: NOT_LOADED,
    [OrderStatus.REFUNDED]: NOT_LOADED,
  });

  // Ref to track if initial load has happened (prevents duplicate calls in React Strict Mode)
  const hasInitialized = useRef(false);
  
  // Ref to track which statuses are currently loading (prevents race conditions)
  const loadingStatusesRef = useRef<Set<OrderStatusType>>(new Set());

  // Fetch active statuses with 24-hour filter
  const fetchActiveOrders = useCallback(async () => {
    try {
      const activeOrdersPromises = ACTIVE_STATUSES.map(async (status) => {
        const response = await getOrdersByStatus({
          status,
          hoursAgo: ACTIVE_STATUS_HOURS_FILTER,
        });
        const ordersData = response.data || [];
        const totalCount = response.total > 0 ? response.total : ordersData.length;
        return {
          status,
          orders: ordersData,
          total: totalCount,
        };
      });

      const results = await Promise.all(activeOrdersPromises);

      setOrders((prev) => {
        const updated = { ...prev };
        results.forEach(({ status, orders }) => {
          updated[status] = orders;
        });
        return updated;
      });

      setTotals((prev) => {
        const updated = { ...prev };
        results.forEach(({ status, total }) => {
          updated[status] = total;
        });
        return updated;
      });

      setLoadedStatuses((prev) => {
        const updated = new Set(prev);
        ACTIVE_STATUSES.forEach((status) => updated.add(status));
        return updated;
      });
    } catch (error) {
      logError('Error fetching active orders:', error);
    }
  }, []);

  // Load a specific status (for lazy loading)
  const loadStatus = useCallback(
    async (
      status: OrderStatusType,
      options?: {
        page?: number;
        searchQuery?: string;
        startDate?: Date;
        endDate?: Date;
      }
    ) => {
      // Check ref first to prevent race conditions
      if (loadingStatusesRef.current.has(status)) {
        return;
      }

      // Set loading state in both ref and state
      loadingStatusesRef.current.add(status);
      setLoadingStatuses((prev) => {
        if (prev.has(status)) {
          return prev; // Already in state, return same reference
        }
        const updated = new Set(prev);
        updated.add(status);
        return updated;
      });

      try {
        const page = options?.page || 1;
        const limit = HISTORICAL_STATUS_PAGE_SIZE;
        const skip = (page - 1) * limit;

        const response = await getOrdersByStatus({
          status,
          limit,
          skip,
          searchQuery: options?.searchQuery,
          startDate: options?.startDate,
          endDate: options?.endDate,
        });

        setOrders((prev) => ({
          ...prev,
          [status]: response.data || [],
        }));

        setTotals((prev) => ({
          ...prev,
          [status]: response.total,
        }));

        setLoadedStatuses((prev) => new Set(prev).add(status));
      } catch (error) {
        logError(`Error loading status ${status}:`, error);
      } finally {
        // Remove from both ref and state
        loadingStatusesRef.current.delete(status);
        setLoadingStatuses((prev) => {
          const updated = new Set(prev);
          updated.delete(status);
          return updated;
        });
      }
    },
    [] // Empty deps - use ref to track loading state
  );

  // Refetch a specific status
  const refetchStatus = useCallback(
    async (status: OrderStatusType) => {
      if (isActiveStatus(status)) {
        // For active statuses, use 24-hour filter
        const response = await getOrdersByStatus({
          status,
          hoursAgo: ACTIVE_STATUS_HOURS_FILTER,
        });
        setOrders((prev) => ({
          ...prev,
          [status]: response.data || [],
        }));
        setTotals((prev) => ({
          ...prev,
          [status]: response.total,
        }));
      } else {
        // For historical statuses, reload with current options
        await loadStatus(status);
      }
    },
    [loadStatus]
  );

  // Refetch only active orders (for auto-refresh)
  const refetchActiveOrders = useCallback(async () => {
    await fetchActiveOrders();
  }, [fetchActiveOrders]);

  // Initial load: fetch active statuses only
  useEffect(() => {
    // Prevent multiple loads (especially in React Strict Mode)
    if (hasInitialized.current) {
      return;
    }

    const initialLoad = async () => {
      hasInitialized.current = true;
      setLoading(true);
      await fetchActiveOrders();
      setLoading(false);
    };
    
    initialLoad();
  }, [fetchActiveOrders]);

  return {
    orders,
    loading,
    loadingStatuses,
    loadedStatuses,
    totals,
    refetchActiveOrders,
    loadStatus,
    refetchStatus,
  };
}

