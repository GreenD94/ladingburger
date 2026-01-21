'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/features/orders/actions/updateOrderStatus.action';
import { OrderStatus } from '@/features/database/types/index.type';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admin/styles/Modal.module.css';

interface CancelOrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: number;
  onSuccess: () => void;
}

export function CancelOrderModal({
  open,
  onClose,
  orderId,
  orderNumber,
  onSuccess,
}: CancelOrderModalProps) {
  const { t } = useLanguage();
  const [reason, setReason] = useState(EMPTY_STRING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(EMPTY_STRING);

  if (!open) {
    return null;
  }

  const hasReason = reason.trim() !== EMPTY_STRING;

  const handleCancel = async () => {
    if (!hasReason) {
      setError(t('cancelReasonRequired'));
      return;
    }

    try {
      setLoading(true);
      setError(EMPTY_STRING);
      const result = await updateOrderStatus(orderId, OrderStatus.CANCELLED, reason);
      
      const isSuccess = result.success;
      if (isSuccess) {
        onSuccess();
        onClose();
        setReason(EMPTY_STRING);
      } else {
        const errorMessage = result.error || t('cancelOrderError');
        setError(errorMessage);
      }
    } catch (err) {
      setError(t('cancelOrderError'));
      console.error('Error cancelling order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason(EMPTY_STRING);
      setError(EMPTY_STRING);
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {t('cancelOrderTitle')} #{orderNumber}
          </h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '16px' }}>
              {t('cancelOrderConfirm')}
            </p>
            <label className={styles.label}>
              {t('cancelReason')}
            </label>
            <textarea
              className={`${styles.textarea} ${error && !hasReason ? styles.inputError : ''}`}
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('cancelReasonPlaceholderExample')}
            />
            {error && (
              <p className={styles.errorText}>{error}</p>
            )}
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={handleClose}
            disabled={loading}
          >
            {t('close')}
          </button>
          <button
            className={`${styles.button} ${styles.buttonDanger}`}
            onClick={handleCancel}
            disabled={loading || !hasReason}
          >
            {loading ? t('canceling') : t('cancelOrder')}
          </button>
        </div>
      </div>
    </div>
  );
}
