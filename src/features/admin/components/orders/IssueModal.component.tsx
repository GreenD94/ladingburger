'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/features/orders/actions/updateOrderStatus.action';
import { OrderStatus } from '@/features/database/types/index.type';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import styles from '@/features/admin/styles/Modal.module.css';

interface IssueModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

export function IssueModal({ open, onClose, orderId, onSuccess }: IssueModalProps) {
  const [comment, setComment] = useState(EMPTY_STRING);
  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, OrderStatus.ISSUE, comment);
      onSuccess();
      onClose();
      setComment(EMPTY_STRING);
    } catch (error) {
      console.error('Error marking order as issue:', error);
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
          <h2 className={styles.modalTitle}>Reportar Problema</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Descripción del problema
            </label>
            <textarea
              className={styles.textarea}
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe el problema que ha ocurrido con esta orden..."
            />
          </div>
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
            className={`${styles.button} ${styles.buttonDanger}`}
            onClick={handleSubmit}
            disabled={loading || comment.trim() === EMPTY_STRING}
          >
            {loading ? 'Guardando...' : 'Reportar Problema'}
          </button>
        </div>
      </div>
    </div>
  );
}
