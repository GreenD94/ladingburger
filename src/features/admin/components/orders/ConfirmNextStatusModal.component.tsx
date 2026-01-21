'use client';

import { useState } from 'react';
import { OrderStatusLabels, OrderStatusType, OrderStatus } from '@/features/database/types/index.type';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import styles from '@/features/admin/styles/Modal.module.css';

interface ConfirmNextStatusModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  currentStatus: OrderStatusType;
  nextStatus: OrderStatusType;
  onConfirm: () => void;
}

export function ConfirmNextStatusModal({ 
  open, 
  onClose, 
  orderId, 
  currentStatus, 
  nextStatus,
  onConfirm 
}: ConfirmNextStatusModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  const hasNextStatus = nextStatus !== OrderStatus.WAITING_PAYMENT;
  const nextStatusLabel = hasNextStatus ? OrderStatusLabels[nextStatus] : EMPTY_STRING;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error updating order status:', error);
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
          <h2 className={styles.modalTitle}>Confirmar Cambio de Estado</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>
        <div className={styles.modalContent}>
          <p>
            ¿Estás seguro de que deseas cambiar el estado de la orden de "{OrderStatusLabels[currentStatus]}" a "{nextStatusLabel || 'siguiente estado'}"?
          </p>
        </div>
        <div className={styles.modalActions}>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
