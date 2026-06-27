'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Bill } from '../types/bill.type';
import { Material } from '../types/material.type';
import { Order } from '@/features/database/types/order.type';
import { Burger } from '@/features/database/types/burger.type';
import { BillRow } from '../components/bills/BillRow.component';
import { BillForm } from '../components/bills/BillForm.component';
import { BillConfirmationModal } from '../components/bills/BillConfirmationModal.component';
import { getBills } from '../actions/bills/getBills.action';
import { getMaterials } from '../actions/materials/getMaterials.action';
import { getOrdersByStatus } from '@/features/orders/actions/getOrdersByStatus.action';
import { getAvailableBurgers } from '@/features/menu/actions/menu.action';
import { estimateBillConsumption } from '../utils/estimateBillConsumption.util';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { OrderStatus } from '@/features/database/types/status.type';
import styles from '../styles/BillsContainer.module.css';

export function BillsContainer() {
  const { t } = useLanguage();
  const [bills, setBills] = useState<Bill[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [burgers, setBurgers] = useState<Record<string, Burger>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(EMPTY_STRING);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | undefined>();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: EMPTY_STRING,
    severity: 'success' as 'success' | 'error',
  });
  const [currentUserId, setCurrentUserId] = useState(EMPTY_STRING);
  const hasInitialized = useRef(false);

  const fetchData = useCallback(async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setLoading(true);
    setError(EMPTY_STRING);

    try {
      const [billsResponse, materialsResponse, burgersResponse] = await Promise.all([
        getBills({ status: 'active' }),
        getMaterials(),
        getAvailableBurgers(),
      ]);

      if (billsResponse.success && billsResponse.data) {
        setBills(billsResponse.data);
      }

      if (materialsResponse.success && materialsResponse.data) {
        setMaterials(materialsResponse.data);
      }

      if (burgersResponse && burgersResponse.length > 0) {
        const burgersMap: Record<string, Burger> = {};
        burgersResponse.forEach(burger => {
          const burgerId = burger._id?.toString() || '';
          if (burgerId) {
            burgersMap[burgerId] = burger;
          }
        });
        setBurgers(burgersMap);
      }

      if (billsResponse.data && billsResponse.data.length > 0) {
        const oldestBillDate = billsResponse.data.reduce((oldest, bill) => {
          const billDate = new Date(bill.purchaseDate);
          return billDate < oldest ? billDate : oldest;
        }, new Date(billsResponse.data[0].purchaseDate));

        const ordersResponse = await getOrdersByStatus({
          status: OrderStatus.COMPLETED,
          startDate: oldestBillDate,
        });

        if (ordersResponse.success && ordersResponse.data) {
          setOrders(ordersResponse.data);
        }
      }
    } catch (err) {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchCurrentAdmin = async () => {
      try {
        const { getCurrentAdmin } = await import('@/features/database/actions/auth/getCurrentAdmin.action');
        const admin = await getCurrentAdmin();
        if (admin && admin._id) {
          setCurrentUserId(admin._id);
        }
      } catch (err) {
        console.error('Error fetching current admin:', err);
      }
    };
    fetchCurrentAdmin();
  }, []);

  const billEstimates = useMemo(() => {
    return bills.map(bill => estimateBillConsumption(bill, orders, burgers));
  }, [bills, orders, burgers]);

  const handleConfirmBill = (bill: Bill) => {
    setSelectedBill(bill);
    setConfirmationModalOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationModalOpen(false);
    setSelectedBill(undefined);
  };

  const handleConfirmationSuccess = () => {
    hasInitialized.current = false;
    fetchData();
    setSnackbar({
      open: true,
      message: t('billConfirmedSuccess'),
      severity: 'success',
    });
  };

  const handleCreateBill = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleFormSuccess = () => {
    hasInitialized.current = false;
    fetchData();
    setSnackbar({
      open: true,
      message: t('billRegisteredSuccess'),
      severity: 'success',
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isLoading = loading;
  const hasError = error !== EMPTY_STRING;
  const hasBills = bills.length > 0;
  const shouldShowContent = !isLoading && !hasError;

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>{t('loading')}</p>
        </div>
      )}

      {hasError && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {shouldShowContent && (
        <>
          <div className={styles.header}>
            <button
              className={styles.addButton}
              onClick={handleCreateBill}
              type="button"
            >
              <span className="material-symbols-outlined">add</span>
              {t('registerBill')}
            </button>
          </div>
          <div className={styles.billsList}>
            {hasBills ? (
              bills.map((bill, index) => (
                <BillRow
                  key={typeof bill._id === 'string' ? bill._id : bill._id?.toString() || ''}
                  bill={bill}
                  estimate={billEstimates[index]}
                  onConfirm={handleConfirmBill}
                />
              ))
            ) : (
              <p className={styles.emptyState}>{t('noBillsFound')}</p>
            )}
          </div>
        </>
      )}

      <BillForm
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      {selectedBill && (
        <BillConfirmationModal
          open={confirmationModalOpen}
          onClose={handleConfirmationClose}
          bill={selectedBill}
          orders={orders}
          burgers={burgers}
          materials={materials}
          currentUserId={currentUserId}
          onSuccess={handleConfirmationSuccess}
        />
      )}

      {snackbar.open && (
        <div className={`${styles.snackbar} ${styles[snackbar.severity]}`}>
          <p className={styles.snackbarMessage}>{snackbar.message}</p>
          <button
            className={styles.snackbarClose}
            onClick={handleSnackbarClose}
            type="button"
            aria-label={t('close')}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
