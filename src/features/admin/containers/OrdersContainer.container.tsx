'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { OrderStatus, OrderStatusType } from '@/features/database/types/index.type';
import { EMPTY_ORDERS_FILTERS_STATE, NOT_LOADED, EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { SimpleOrderCard } from '@/features/admin/components/orders/SimpleOrderCard.component';
import { OrderSkeletonList } from '@/features/admin/components/orders/OrderSkeletonList.component';
import { StatusFilterChips } from '@/features/admin/components/orders/StatusFilterChips.component';
import { OrdersFilters, OrdersFiltersState } from '@/features/admin/components/orders/OrdersFilters.component';
import { useOrders } from '@/features/admin/hooks/useOrders.hook';
import { Order } from '@/features/database/types/index.type';
import { updateOrderStatus } from '@/features/orders/actions/updateOrderStatus.action';
import { useBurgers } from '@/features/orders/hooks/useBurgers.hook';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import { isActiveStatus, isHistoricalStatus, HISTORICAL_STATUS_PAGE_SIZE } from '@/features/admin/constants/orderStatusGroups.constants';
import { logError } from '@/features/menu/utils/logError.util';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admin/styles/OrdersContainer.module.css';

const AUTO_REFRESH_INTERVAL = 30000;

export default function OrdersContainer() {
  const { t } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusType>(OrderStatus.WAITING_PAYMENT);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [filters, setFilters] = useState<OrdersFiltersState>(EMPTY_ORDERS_FILTERS_STATE);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});
  
  // Pagination state for historical statuses
  const [currentPage, setCurrentPage] = useState(1);
  const [serverSearchQuery, setServerSearchQuery] = useState(''); // Debounced search for server

  const {
    orders,
    loading,
    loadingStatuses,
    loadedStatuses,
    totals,
    refetchActiveOrders,
    loadStatus,
    refetchStatus,
  } = useOrders();
  const { burgers, loading: burgersLoading, error: burgersError } = useBurgers();

  // Auto-refresh only active statuses
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetchActiveOrders();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [autoRefresh, refetchActiveOrders]);

  // Debounce search query for server-side search (historical statuses)
  useEffect(() => {
    if (!isHistoricalStatus(selectedStatus)) {
      return;
    }

    const timer = setTimeout(() => {
      setServerSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedStatus]);

  // Load status when selected (lazy loading for historical statuses)
  useEffect(() => {
    if (isHistoricalStatus(selectedStatus) && !loadedStatuses.has(selectedStatus) && !loadingStatuses.has(selectedStatus)) {
      const hasStartDate = filters.dateRange.start.getTime() !== 0;
      const hasEndDate = filters.dateRange.end.getTime() !== 0;
      const loadOptions: {
        page: number;
        searchQuery?: string;
        startDate?: Date;
        endDate?: Date;
      } = {
        page: currentPage,
      };
      if (serverSearchQuery) {
        loadOptions.searchQuery = serverSearchQuery;
      }
      if (hasStartDate) {
        loadOptions.startDate = filters.dateRange.start;
      }
      if (hasEndDate) {
        loadOptions.endDate = filters.dateRange.end;
      }
      loadStatus(selectedStatus, loadOptions);
    }
  }, [selectedStatus, currentPage, serverSearchQuery, filters.dateRange.start, filters.dateRange.end, loadStatus]);

  // Reload when filters change (for historical statuses)
  useEffect(() => {
    if (isHistoricalStatus(selectedStatus) && loadedStatuses.has(selectedStatus)) {
      setCurrentPage(1);
      const hasStartDate = filters.dateRange.start.getTime() !== 0;
      const hasEndDate = filters.dateRange.end.getTime() !== 0;
      const loadOptions: {
        page: number;
        searchQuery?: string;
        startDate?: Date;
        endDate?: Date;
      } = {
        page: 1,
      };
      if (serverSearchQuery) {
        loadOptions.searchQuery = serverSearchQuery;
      }
      if (hasStartDate) {
        loadOptions.startDate = filters.dateRange.start;
      }
      if (hasEndDate) {
        loadOptions.endDate = filters.dateRange.end;
      }
      loadStatus(selectedStatus, loadOptions);
    }
  }, [filters.dateRange.start, filters.dateRange.end, selectedStatus, serverSearchQuery, loadStatus]);

  // Reload when page changes (for historical statuses)
  useEffect(() => {
    if (isHistoricalStatus(selectedStatus) && loadedStatuses.has(selectedStatus)) {
      const hasStartDate = filters.dateRange.start.getTime() !== 0;
      const hasEndDate = filters.dateRange.end.getTime() !== 0;
      const loadOptions: {
        page: number;
        searchQuery?: string;
        startDate?: Date;
        endDate?: Date;
      } = {
        page: currentPage,
      };
      if (serverSearchQuery) {
        loadOptions.searchQuery = serverSearchQuery;
      }
      if (hasStartDate) {
        loadOptions.startDate = filters.dateRange.start;
      }
      if (hasEndDate) {
        loadOptions.endDate = filters.dateRange.end;
      }
      loadStatus(selectedStatus, loadOptions);
    }
  }, [currentPage, selectedStatus, serverSearchQuery, filters.dateRange.start, filters.dateRange.end, loadStatus]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (isActiveStatus(selectedStatus)) {
      await refetchActiveOrders();
    } else {
      await refetchStatus(selectedStatus);
    }
    setIsRefreshing(false);
  };

  const getBurgerName = (burgerId: string) => {
    const burger = burgers[burgerId];
    return burger?.name || t('burgerNotFound');
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatusType) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      await updateOrderStatus(orderId, newStatus);
      // Refetch the affected statuses
      await refetchStatus(selectedStatus);
      if (newStatus !== selectedStatus) {
        await refetchStatus(newStatus);
      }
    } catch (error) {
      logError('Error updating order status:', error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleStatusChipChange = useCallback((status: OrderStatusType) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    setSearchQuery('');
    setServerSearchQuery('');
  }, []);

  // Build order counts - show totals for loaded statuses, NOT_LOADED for unloaded
  const orderCounts = Object.values(OrderStatus).reduce((acc, status) => {
    if (loadedStatuses.has(status)) {
      acc[status] = totals[status] === NOT_LOADED ? (orders[status]?.length ?? 0) : totals[status];
    } else {
      acc[status] = NOT_LOADED; // NOT_LOADED means not loaded yet
    }
    return acc;
  }, {} as Record<OrderStatusType, number>);

  // Client-side filtering for active statuses only
  const filterOrders = useCallback((ordersToFilter: Order[]): Order[] => {
    if (!isActiveStatus(selectedStatus)) {
      // For historical statuses, filtering is done server-side
      return ordersToFilter;
    }

    let filtered = [...ordersToFilter];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const orderId = order._id?.toString().toLowerCase() || '';
        const orderNumber = order.orderNumber?.toString().toLowerCase() || '';
        const phone = order.customerPhone.toLowerCase();
        const customerName = order.customerName?.toLowerCase() || '';
        return orderId.includes(query) || orderNumber.includes(query) || phone.includes(query) || customerName.includes(query);
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

    const hasMinAmount = filters.amountRange.min !== 0;
    const hasMaxAmount = filters.amountRange.max !== 0;

    if (hasMinAmount) {
      filtered = filtered.filter((order) => order.totalPrice >= filters.amountRange.min);
    }
    if (hasMaxAmount) {
      filtered = filtered.filter((order) => order.totalPrice <= filters.amountRange.max);
    }

    return filtered;
  }, [selectedStatus, searchQuery, filters]);

  const filteredOrders = useMemo(() => {
    return filterOrders(orders[selectedStatus] || []);
  }, [orders, selectedStatus, filterOrders]);

  const isLoadingCurrentStatus = loadingStatuses.has(selectedStatus);
  const isCurrentStatusLoaded = loadedStatuses.has(selectedStatus) || isActiveStatus(selectedStatus);
  const currentTotal = totals[selectedStatus];
  const totalPages = currentTotal !== NOT_LOADED ? Math.ceil(currentTotal / HISTORICAL_STATUS_PAGE_SIZE) : 0;

  if (loading || burgersLoading) {
    return <OrderSkeletonList />;
  }

  if (burgersError) {
    return <ErrorState error={burgersError} onRetry={() => window.location.reload()} />;
  }

  return (
    <SafeArea className={styles.container} sides="all">
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitle}>
            <span className={`material-symbols-outlined ${styles.headerIcon}`}>
              restaurant_menu
            </span>
            <h1 className={styles.headerText}>{t('orders')}</h1>
          </div>
          <div className={styles.headerActions}>
            {isHistoricalStatus(selectedStatus) && (
              <button
                className={styles.iconButton}
                onClick={() => setFiltersOpen(true)}
                aria-label={t('filters')}
              >
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            )}
            <button
              className={styles.iconButton}
              onClick={handleRefresh}
              disabled={isRefreshing || isLoadingCurrentStatus}
              aria-label={t('refresh')}
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
        </div>

        <div className={styles.searchWrapper}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <StatusFilterChips
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChipChange}
        orderCounts={orderCounts}
      />

      <div className={styles.ordersList}>
        {isLoadingCurrentStatus ? (
          <OrderSkeletonList />
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay pedidos en este estado</p>
          </div>
        ) : (
          <div className={styles.ordersStack}>
            {filteredOrders.map((order) => (
              <SimpleOrderCard
                key={order._id?.toString()}
                order={order}
                onStatusChange={handleStatusChange}
                updatingStatus={updatingStatus}
                getBurgerName={getBurgerName}
                onPaymentUpdate={() => refetchStatus(selectedStatus)}
              />
            ))}
            <div className={styles.spacer} />
          </div>
        )}
      </div>

      {/* Pagination for historical statuses */}
      {isHistoricalStatus(selectedStatus) && isCurrentStatusLoaded && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoadingCurrentStatus}
          >
            <span className="material-symbols-outlined">chevron_left</span>
            Anterior
          </button>
          <span className={styles.paginationInfo}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || isLoadingCurrentStatus}
          >
            Siguiente
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}

      {isHistoricalStatus(selectedStatus) && (
        <OrdersFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClear={() => {
            setFilters(EMPTY_ORDERS_FILTERS_STATE);
          }}
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </SafeArea>
  );
}
