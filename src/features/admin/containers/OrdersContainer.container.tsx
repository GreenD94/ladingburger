'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import { OrderStatus, OrderStatusType, PaymentStatus } from '@/features/database/types/index.type';
import { EMPTY_ORDERS_FILTERS_STATE } from '@/features/database/constants/emptyValues.constants';
import { TabPanel } from '@/features/admin/components/orders/TabPanel.component';
import { OrderTabs } from '@/features/admin/components/orders/OrderTabs.component';
import OrdersList from '@/features/admin/components/orders/OrdersList.component';
import { OrderSkeletonList } from '@/features/admin/components/orders/OrderSkeletonList.component';
import { OrdersDashboardHeader } from '@/features/admin/components/orders/OrdersDashboardHeader.component';
import { OrdersFilters, OrdersFiltersState } from '@/features/admin/components/orders/OrdersFilters.component';
import { useOrders } from '@/features/admin/hooks/useOrders.hook';
import { Order } from '@/features/database/types/index.type';

const AUTO_REFRESH_INTERVAL = 30000;

const getStatusBackgroundColor = (status: number) => {
  switch (status) {
    case OrderStatus.WAITING_PAYMENT:
      return 'rgba(255, 183, 77, 0.1)';
    case OrderStatus.COOKING:
      return 'rgba(255, 87, 34, 0.1)';
    case OrderStatus.IN_TRANSIT:
      return 'rgba(76, 175, 80, 0.1)';
    case OrderStatus.WAITING_PICKUP:
      return 'rgba(33, 150, 243, 0.1)';
    case OrderStatus.COMPLETED:
      return 'rgba(76, 175, 80, 0.1)';
    case OrderStatus.ISSUE:
      return 'rgba(244, 67, 54, 0.1)';
    default:
      return 'rgba(158, 158, 158, 0.1)';
  }
};

export default function OrdersContainer() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'pending' | 'unpaid' | 'urgent'>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [filters, setFilters] = useState<OrdersFiltersState>(EMPTY_ORDERS_FILTERS_STATE);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { orders, loading, refetchOrders } = useOrders();

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetchOrders();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [autoRefresh, refetchOrders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchOrders();
    setIsRefreshing(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const orderCounts = Object.values(OrderStatus).reduce((acc, status) => {
    acc[status] = orders[status]?.length || 0;
    return acc;
  }, {} as Record<typeof OrderStatus[keyof typeof OrderStatus], number>);

  const filterOrders = (ordersToFilter: Order[]): Order[] => {
    let filtered = [...ordersToFilter];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const orderId = order._id?.toString().toLowerCase() || '';
        const phone = order.customerPhone.toLowerCase();
        const customerName = order.customerName?.toLowerCase() || '';
        return orderId.includes(query) || phone.includes(query) || customerName.includes(query);
      });
    }

    const hasStartDate = filters.dateRange.start.getTime() !== 0;
    const hasEndDate = filters.dateRange.end.getTime() !== 0;

    if (hasStartDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= filters.dateRange.start;
      });
    }
    if (hasEndDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        return orderDate <= endDate;
      });
    }

    if (filters.statuses.length > 0) {
      filtered = filtered.filter((order) => filters.statuses.includes(order.status));
    }

    if (filters.paymentStatuses.length > 0) {
      filtered = filtered.filter((order) =>
        filters.paymentStatuses.includes(order.paymentInfo.paymentStatus)
      );
    }

    const hasMinAmount = filters.amountRange.min !== 0;
    const hasMaxAmount = filters.amountRange.max !== 0;

    if (hasMinAmount) {
      filtered = filtered.filter((order) => order.totalPrice >= filters.amountRange.min);
    }
    if (hasMaxAmount) {
      filtered = filtered.filter((order) => order.totalPrice <= filters.amountRange.max);
    }

    if (quickFilter === 'pending') {
      const pendingStatuses: OrderStatusType[] = [OrderStatus.WAITING_PAYMENT, OrderStatus.COOKING, OrderStatus.IN_TRANSIT, OrderStatus.WAITING_PICKUP];
      filtered = filtered.filter((order) => pendingStatuses.includes(order.status));
    } else if (quickFilter === 'unpaid') {
      filtered = filtered.filter((order) =>
        order.status === OrderStatus.WAITING_PAYMENT && order.paymentInfo.paymentStatus === PaymentStatus.PENDING
      );
    } else if (quickFilter === 'urgent') {
      filtered = filtered.filter((order) => order.status === OrderStatus.ISSUE);
    }

    return filtered;
  };

  const filteredOrdersByStatus = useMemo(() => {
    const result: Record<OrderStatusType, Order[]> = {
      [OrderStatus.WAITING_PAYMENT]: [],
      [OrderStatus.COOKING]: [],
      [OrderStatus.IN_TRANSIT]: [],
      [OrderStatus.WAITING_PICKUP]: [],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.ISSUE]: [],
    };

    Object.values(OrderStatus).forEach((status) => {
      result[status] = filterOrders(orders[status] || []);
    });

    return result;
  }, [orders, searchQuery, filters, quickFilter]);

  if (loading) {
    return <OrderSkeletonList />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <OrdersDashboardHeader
        orderCounts={orderCounts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        quickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={setAutoRefresh}
      />

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <OrdersFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClear={() => {
            setFilters(EMPTY_ORDERS_FILTERS_STATE);
          }}
        />
      </Stack>

      <OrderTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        orderCounts={orderCounts}
      />

      {Object.values(OrderStatus).map((status, index) => (
        <TabPanel 
          key={status} 
          value={activeTab} 
          index={index}
          sx={{
            backgroundColor: getStatusBackgroundColor(status),
            borderRadius: 2,
            p: 2,
            mt: 2,
          }}
        >
          <OrdersList 
            orders={filteredOrdersByStatus[status]} 
            onStatusChange={refetchOrders}
            onPaymentUpdate={refetchOrders}
          />
        </TabPanel>
      ))}
    </Box>
  );
}

