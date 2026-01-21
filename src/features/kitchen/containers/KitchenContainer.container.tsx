'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Order, OrderStatus } from '@/features/database/types/index.type';
import { getOrdersByStatus } from '@/features/orders/actions/getOrdersByStatus.action';
import { updateOrderStatus } from '@/features/orders/actions/updateOrderStatus.action';
import { takeOrder } from '../actions/takeOrder.action';
import { getCurrentAdmin } from '@/features/database/actions/auth/getCurrentAdmin.action';
import { useBurgers } from '@/features/orders/hooks/useBurgers.hook';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import { KitchenOrderCard } from '../components/KitchenOrderCard.component';
import { OrderSkeletonList } from '@/features/admin/components/orders/OrderSkeletonList.component';
import LoadingState from '@/features/analytics/components/shared/LoadingState.component';
import ErrorState from '@/features/analytics/components/shared/ErrorState.component';
import { logError } from '@/features/menu/utils/logError.util';
import { ACTIVE_STATUS_HOURS_FILTER } from '@/features/admin/constants/orderStatusGroups.constants';
import styles from '../styles/KitchenContainer.module.css';

const AUTO_REFRESH_INTERVAL = 30000;

type TabType = 'pending' | 'myCooking';

export default function KitchenContainer() {
  const { t } = useLanguage();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [cookingOrders, setCookingOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { burgers, loading: burgersLoading, error: burgersError } = useBurgers();
  const hasInitialized = useRef(false);
  const chefIdRef = useRef('');
  const chefIdLoaded = useRef(false);

  const fetchKitchenOrders = useCallback(async () => {
    try {
      const [pendingResponse, cookingResponse, readyResponse] = await Promise.all([
        getOrdersByStatus({
          status: OrderStatus.PENDING,
          hoursAgo: ACTIVE_STATUS_HOURS_FILTER,
        }),
        getOrdersByStatus({
          status: OrderStatus.COOKING,
          hoursAgo: ACTIVE_STATUS_HOURS_FILTER,
        }),
        getOrdersByStatus({
          status: OrderStatus.READY,
          hoursAgo: ACTIVE_STATUS_HOURS_FILTER,
        }),
      ]);

      setPendingOrders(pendingResponse.data || []);
      setCookingOrders(cookingResponse.data || []);
      setReadyOrders(readyResponse.data || []);
    } catch (error) {
      logError('Error fetching kitchen orders:', error);
    }
  }, []);

  useEffect(() => {
    const loadChefId = async () => {
      if (chefIdLoaded.current) {
        return;
      }
      try {
        const admin = await getCurrentAdmin();
        if (admin._id) {
          chefIdRef.current = admin._id;
        } else {
          chefIdRef.current = 'unknown';
        }
        chefIdLoaded.current = true;
      } catch (error) {
        logError('Error loading chef ID:', error);
        chefIdRef.current = 'unknown';
        chefIdLoaded.current = true;
      }
    };

    loadChefId();
  }, []);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    const initialLoad = async () => {
      hasInitialized.current = true;
      setLoading(true);
      await fetchKitchenOrders();
      setLoading(false);
    };

    initialLoad();
  }, [fetchKitchenOrders]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchKitchenOrders();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchKitchenOrders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchKitchenOrders();
    setIsRefreshing(false);
  };

  const getBurgerName = (burgerId: string) => {
    const burger = burgers[burgerId];
    return burger?.name || t('burgerNotFound');
  };

  const burgersMap = burgers;

  const myCookingOrders = cookingOrders.filter((order) => order.assignedTo === chefIdRef.current);
  const hasOrderInCooking = myCookingOrders.length > 0;

  const handleTakeOrder = async (orderId: string) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      const result = await takeOrder(orderId, chefIdRef.current);
      if (result.success) {
        await fetchKitchenOrders();
        setActiveTab('myCooking');
      }
    } catch (error) {
      logError('Error taking order:', error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleMarkAsReady = async (orderId: string) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      const result = await updateOrderStatus(orderId, OrderStatus.READY);
      if (result.success) {
        await fetchKitchenOrders();
      }
    } catch (error) {
      logError('Error marking order as ready:', error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading || burgersLoading) {
    return <OrderSkeletonList />;
  }

  if (burgersError) {
    return <ErrorState error={burgersError} onRetry={() => window.location.reload()} />;
  }

  const allOrders = [...cookingOrders, ...readyOrders];

  return (
    <SafeArea className={styles.container} sides="all">
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitle}>
            <span className={`material-symbols-outlined ${styles.headerIcon}`}>
              restaurant
            </span>
            <h1 className={styles.headerText}>{t('kitchen')}</h1>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.iconButton}
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label={t('refresh')}
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
            <button
              className={`${styles.iconButton} ${autoRefresh ? styles.active : ''}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
              aria-label={t('autoRefresh')}
            >
              <span className="material-symbols-outlined">
                {autoRefresh ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'pending' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          {t('pending')}
          {pendingOrders.length > 0 && (
            <span className={styles.tabBadge}>{pendingOrders.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'myCooking' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('myCooking')}
        >
          {t('cooking')}
          {myCookingOrders.length > 0 && (
            <span className={styles.tabBadge}>{myCookingOrders.length}</span>
          )}
        </button>
      </div>

      <div className={styles.ordersList}>
        {activeTab === 'pending' && (
          <>
            {pendingOrders.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{t('noPendingOrders')}</p>
              </div>
            ) : (
              <div className={styles.ordersStack}>
                {pendingOrders.map((order) => (
                  <KitchenOrderCard
                    key={order._id?.toString()}
                    order={order}
                    onTakeOrder={hasOrderInCooking ? undefined : handleTakeOrder}
                    onMarkAsReady={handleMarkAsReady}
                    updatingStatus={updatingStatus}
                    getBurgerName={getBurgerName}
                    isPending={true}
                    isReady={false}
                    burgers={burgersMap}
                  />
                ))}
                <div className={styles.spacer} />
              </div>
            )}
          </>
        )}

        {activeTab === 'myCooking' && (
          <>
            {myCookingOrders.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{t('noMyCookingOrders')}</p>
              </div>
            ) : (
              <div className={styles.ordersStack}>
                {myCookingOrders.map((order) => (
                  <KitchenOrderCard
                    key={order._id?.toString()}
                    order={order}
                    onTakeOrder={undefined}
                    onMarkAsReady={handleMarkAsReady}
                    updatingStatus={updatingStatus}
                    getBurgerName={getBurgerName}
                    isPending={false}
                    isReady={false}
                    burgers={burgersMap}
                  />
                ))}
                <div className={styles.spacer} />
              </div>
            )}
          </>
        )}
      </div>
    </SafeArea>
  );
}

