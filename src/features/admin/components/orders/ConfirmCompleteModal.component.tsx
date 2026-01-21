'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/features/orders/actions/updateOrderStatus.action';
import { OrderStatus } from '@/features/database/types/index.type';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admin/styles/Modal.module.css';

interface ConfirmCompleteModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

export function ConfirmCompleteModal({ open, onClose, orderId, onSuccess }: ConfirmCompleteModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, OrderStatus.COMPLETED);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error completing order:', error);
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
          <h2 className={styles.modalTitle}>{t('confirmComplete')}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>
        <div className={styles.modalContent}>
          <p>{t('confirmCompleteMessage')}</p>
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
            className={`${styles.button} ${styles.buttonSuccess}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? t('completing') : t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
