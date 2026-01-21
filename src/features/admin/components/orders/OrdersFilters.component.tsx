'use client';

import React, { useState, useEffect } from 'react';
import { OrderStatus, OrderStatusType, OrderStatusLabels } from '@/features/database/types/index.type';
import { EMPTY_ORDERS_FILTERS_STATE } from '@/features/database/constants/emptyValues.constants';
import { MOBILE_BREAKPOINT } from '@/features/admin/constants/responsive.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admin/styles/Modal.module.css';

export interface OrdersFiltersState {
  dateRange: {
    start: Date;
    end: Date;
  };
  statuses: OrderStatusType[];
  amountRange: {
    min: number;
    max: number;
  };
}

interface OrdersFiltersProps {
  filters: OrdersFiltersState;
  onFiltersChange: (filters: OrdersFiltersState) => void;
  onClear: () => void;
  open?: boolean;
  onClose?: () => void;
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear,
  open,
  onClose,
}) => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hasStartDate = filters.dateRange.start.getTime() !== 0;
  const hasEndDate = filters.dateRange.end.getTime() !== 0;
  const hasMinAmount = filters.amountRange.min !== 0;
  const hasMaxAmount = filters.amountRange.max !== 0;

  const handleStatusChange = (status: OrderStatusType) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleClear = () => {
    onClear();
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className={isMobile ? styles.overlayFullScreen : styles.overlay} onClick={handleOverlayClick}>
      <div className={isMobile ? styles.modalFullScreen : styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{t('advancedFilters')}</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <div>
              <label className={styles.label}>{t('dateRange')}</label>
              <div className={isMobile ? '' : styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('startDate')}</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={hasStartDate ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : new Date(0);
                      onFiltersChange({
                        ...filters,
                        dateRange: { ...filters.dateRange, start: date },
                      });
                    }}
                    style={{ minHeight: isMobile ? 56 : 40 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('endDate')}</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={hasEndDate ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : new Date(0);
                      onFiltersChange({
                        ...filters,
                        dateRange: { ...filters.dateRange, end: date },
                      });
                    }}
                    style={{ minHeight: isMobile ? 56 : 40 }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={styles.label}>{t('orderStatus')}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {Object.values(OrderStatus).map((status) => {
                  const isSelected = filters.statuses.includes(status);
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      style={{
                        minHeight: isMobile ? 40 : 32,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        border: isSelected ? '1px solid #135bec' : '1px solid #e0e0e0',
                        backgroundColor: isSelected ? '#135bec' : 'transparent',
                        color: isSelected ? '#ffffff' : '#111318',
                        fontSize: '0.875rem',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {OrderStatusLabels[status]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className={styles.label}>{t('amountRange')}</label>
              <div className={isMobile ? '' : styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('minAmount')}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>$</span>
                    <input
                      type="number"
                      className={styles.input}
                      value={hasMinAmount ? filters.amountRange.min : ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : 0;
                        onFiltersChange({
                          ...filters,
                          amountRange: { ...filters.amountRange, min: value },
                        });
                      }}
                      style={{ paddingLeft: '32px', minHeight: isMobile ? 56 : 40 }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label} style={{ fontSize: '0.75rem' }}>{t('maxAmount')}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>$</span>
                    <input
                      type="number"
                      className={styles.input}
                      value={hasMaxAmount ? filters.amountRange.max : ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : 0;
                        onFiltersChange({
                          ...filters,
                          amountRange: { ...filters.amountRange, max: value },
                        });
                      }}
                      style={{ paddingLeft: '32px', minHeight: isMobile ? 56 : 40 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.modalActions} ${styles.modalActionsColumn}`}>
          <button
            className={`${styles.button} ${styles.buttonDanger} ${styles.buttonFullWidth}`}
            onClick={handleClear}
            style={{ minHeight: isMobile ? 44 : 36 }}
          >
            {t('clearAll')}
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFullWidth}`}
            onClick={handleClose}
            style={{ minHeight: isMobile ? 44 : 36 }}
          >
            {t('apply')}
          </button>
        </div>
      </div>
    </div>
  );
};
