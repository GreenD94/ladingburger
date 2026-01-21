'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Order, OrderStatus, OrderStatusType, OrderStatusLabels } from '@/features/database/types/index.type';
import { formatDateWithTime } from '@/features/users/utils/dateFormat.util';
import { getOrdersByCustomerPhonePaginated, OrderFilters } from '@/features/orders/actions/getOrdersByCustomerPhonePaginated.action';
import { OrderDetailModal } from '@/features/admin/components/orders/OrderDetailModal.component';
import { useBurgers } from '@/features/orders/hooks/useBurgers.hook';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { PillSelect } from '@/features/shared/components/PillSelect.component';
import { PillSelectOption } from '@/features/shared/types/pillSelect.type';
import styles from '@/features/users/styles/UserHistoryTab.module.css';

interface UserHistoryTabProps {
  phoneNumber: string;
}

function getStatusLabel(status: number): string {
  return OrderStatusLabels[status as OrderStatusType] || 'Desconocido';
}

const STATUS_OPTIONS: PillSelectOption[] = [
  { id: 'all', value: 'all', label: 'Todos' },
  { id: '1', value: String(OrderStatus.WAITING_PAYMENT), label: OrderStatusLabels[OrderStatus.WAITING_PAYMENT] },
  { id: '2', value: String(OrderStatus.PAYMENT_FAILED), label: OrderStatusLabels[OrderStatus.PAYMENT_FAILED] },
  { id: '3', value: String(OrderStatus.COOKING), label: OrderStatusLabels[OrderStatus.COOKING] },
  { id: '4', value: String(OrderStatus.IN_TRANSIT), label: OrderStatusLabels[OrderStatus.IN_TRANSIT] },
  { id: '5', value: String(OrderStatus.WAITING_PICKUP), label: OrderStatusLabels[OrderStatus.WAITING_PICKUP] },
  { id: '6', value: String(OrderStatus.COMPLETED), label: OrderStatusLabels[OrderStatus.COMPLETED] },
  { id: '7', value: String(OrderStatus.ISSUE), label: OrderStatusLabels[OrderStatus.ISSUE] },
  { id: '8', value: String(OrderStatus.CANCELLED), label: OrderStatusLabels[OrderStatus.CANCELLED] },
  { id: '9', value: String(OrderStatus.REFUNDED), label: OrderStatusLabels[OrderStatus.REFUNDED] },
];

export function UserHistoryTab({ phoneNumber }: UserHistoryTabProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>(EMPTY_STRING);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>(EMPTY_STRING);
  const [endDate, setEndDate] = useState<string>(EMPTY_STRING);
  const [minAmount, setMinAmount] = useState<string>(EMPTY_STRING);
  const [maxAmount, setMaxAmount] = useState<string>(EMPTY_STRING);
  const [showFilters, setShowFilters] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const { burgers, loading: burgersLoading } = useBurgers();

  const getBurgerName = useCallback((burgerId: string): string => {
    const burger = burgers[burgerId];
    return burger?.name || 'Producto desconocido';
  }, [burgers]);

  const fetchOrders = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (loading || loadingMore) return;

    if (reset) {
      setLoading(true);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const filters: OrderFilters = {};

      if (searchText.trim() !== EMPTY_STRING) {
        filters.searchText = searchText.trim();
      }

      if (selectedStatus !== 'all') {
        filters.status = parseInt(selectedStatus, 10) as OrderStatusType;
      }

      if (startDate !== EMPTY_STRING) {
        filters.startDate = new Date(startDate);
      }

      if (endDate !== EMPTY_STRING) {
        filters.endDate = new Date(endDate);
      }

      if (minAmount !== EMPTY_STRING && !isNaN(parseFloat(minAmount))) {
        filters.minAmount = parseFloat(minAmount);
      }

      if (maxAmount !== EMPTY_STRING && !isNaN(parseFloat(maxAmount))) {
        filters.maxAmount = parseFloat(maxAmount);
      }

      const response = await getOrdersByCustomerPhonePaginated(phoneNumber, pageNum, filters);
      
      if (reset) {
        setOrders(response.orders);
      } else {
        setOrders(prev => [...prev, ...response.orders]);
      }
      
      setHasMore(response.hasMore);
      if (!reset) {
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [phoneNumber, searchText, selectedStatus, startDate, endDate, minAmount, maxAmount, loading, loadingMore]);

  useEffect(() => {
    if (phoneNumber && phoneNumber !== EMPTY_STRING) {
      fetchOrders(1, true);
    }
  }, [phoneNumber]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phoneNumber && phoneNumber !== EMPTY_STRING) {
        fetchOrders(1, true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, selectedStatus, startDate, endDate, minAmount, maxAmount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchOrders(page + 1, false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadingMore, page, fetchOrders]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchText(EMPTY_STRING);
    setSelectedStatus('all');
    setStartDate(EMPTY_STRING);
    setEndDate(EMPTY_STRING);
    setMinAmount(EMPTY_STRING);
    setMaxAmount(EMPTY_STRING);
  };

  const hasActiveFilters = selectedStatus !== 'all' || 
    searchText !== EMPTY_STRING || 
    startDate !== EMPTY_STRING || 
    endDate !== EMPTY_STRING || 
    minAmount !== EMPTY_STRING || 
    maxAmount !== EMPTY_STRING;

  if (loading && orders.length === 0) {
    return (
      <div className={styles.content}>
        <div className={styles.loadingState}>
          <span className={`material-symbols-outlined ${styles.loadingIcon}`}>hourglass_empty</span>
          <p className={styles.loadingText}>Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por número de pedido, nombre o referencia..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText !== EMPTY_STRING && (
            <button
              className={styles.clearButton}
              onClick={() => setSearchText(EMPTY_STRING)}
              aria-label="Limpiar búsqueda"
            >
              <span className={`material-symbols-outlined ${styles.clearIcon}`}>close</span>
            </button>
          )}
        </div>
        <button
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Mostrar filtros"
        >
          <span className={`material-symbols-outlined ${styles.filterIcon}`}>tune</span>
          {hasActiveFilters && <span className={styles.filterBadge}></span>}
        </button>
      </div>

      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Estado</label>
            <PillSelect
              options={STATUS_OPTIONS}
              selectedValues={[selectedStatus]}
              onSelectionChange={(values) => setSelectedStatus(values.length > 0 ? values[0] : 'all')}
              multiple={false}
              searchable={false}
              placeholder="Seleccione estado"
              className={styles.statusSelect}
            />
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Fecha Inicio</label>
              <input
                type="date"
                className={styles.dateInput}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Fecha Fin</label>
              <input
                type="date"
                className={styles.dateInput}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Monto Mínimo</label>
              <input
                type="number"
                className={styles.amountInput}
                placeholder="0.00"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Monto Máximo</label>
              <input
                type="number"
                className={styles.amountInput}
                placeholder="0.00"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button className={styles.clearFiltersButton} onClick={handleClearFilters}>
              <span className={`material-symbols-outlined ${styles.clearFiltersIcon}`}>clear_all</span>
              Limpiar Filtros
            </button>
          )}
        </div>
      )}

      {orders.length === 0 && !loading ? (
        <div className={styles.emptyState}>
          <span className={`material-symbols-outlined ${styles.emptyIcon}`}>receipt_long</span>
          <p className={styles.emptyText}>
            {hasActiveFilters ? 'No se encontraron pedidos con los filtros aplicados' : 'No hay pedidos registrados'}
          </p>
        </div>
      ) : (
        <div className={styles.ordersList} ref={scrollContainerRef}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <p className={styles.orderId}>Pedido #{order._id?.toString().slice(-6) || 'N/A'}</p>
                  <p className={styles.orderDate}>{formatDateWithTime(order.createdAt)}</p>
                </div>
                <span className={`${styles.orderStatus} ${styles[`status${order.status}`]}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className={styles.orderDetails}>
                <div>
                  <p className={styles.orderTotal}>
                    Total: ${order.totalPrice.toLocaleString()}
                  </p>
                  <p className={styles.orderItems}>
                    {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                  </p>
                </div>
                <button
                  className={styles.detailButton}
                  onClick={() => handleOrderClick(order)}
                  aria-label="Ver detalles del pedido"
                >
                  <span className={`material-symbols-outlined ${styles.detailIcon}`}>visibility</span>
                  <span className={styles.detailText}>Ver Detalles</span>
                </button>
              </div>
            </div>
          ))}
          {loadingMore && (
            <div className={styles.loadingMore}>
              <span className={`material-symbols-outlined ${styles.loadingIcon}`}>hourglass_empty</span>
              <p className={styles.loadingText}>Cargando más pedidos...</p>
            </div>
          )}
          <div ref={observerTarget} className={styles.observerTarget} />
        </div>
      )}

      {selectedOrder && !burgersLoading && (
        <OrderDetailModal
          open={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          getBurgerName={getBurgerName}
          onStatusChange={async () => {}}
          onPaymentUpdate={() => {
            fetchOrders(1, true);
          }}
          updatingStatus={{}}
        />
      )}
    </div>
  );
}
