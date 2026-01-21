'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/features/orders/actions/updateOrderStatus.action';
import { OrderStatus } from '@/features/database/types/index.type';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admin/styles/Modal.module.css';

interface RefundOrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: number;
  onSuccess: () => void;
}

export function RefundOrderModal({
  open,
  onClose,
  orderId,
  orderNumber,
  onSuccess,
}: RefundOrderModalProps) {
  const { t } = useLanguage();
  const [reason, setReason] = useState(EMPTY_STRING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(EMPTY_STRING);

  if (!open) {
    return null;
  }

  const hasReason = reason.trim() !== EMPTY_STRING;

  const handleRefund = async () => {
    if (!hasReason) {
      setError(t('refundReasonRequired'));
      return;
    }

    try {
      setLoading(true);
      setError(EMPTY_STRING);
      const result = await updateOrderStatus(orderId, OrderStatus.REFUNDED, reason);
      
      const isSuccess = result.success;
      if (isSuccess) {
        onSuccess();
        onClose();
        setReason(EMPTY_STRING);
      } else {
        setError(result.error || t('refundOrderError'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('refundOrderError'));
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{t('refundOrder')} #{orderNumber}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('refundReason')}
            </label>
            <textarea
              className={styles.textarea}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('refundReasonPlaceholder')}
              rows={4}
              required
            />
            {error && (
              <p className={styles.errorText}>{error}</p>
            )}
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onClose}
            disabled={loading}
          >
            {t('cancel')}
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleRefund}
            disabled={loading || !hasReason}
          >
            {loading ? t('refunding') : t('confirmRefund')}
          </button>
        </div>
      </div>
    </div>
  );
}

