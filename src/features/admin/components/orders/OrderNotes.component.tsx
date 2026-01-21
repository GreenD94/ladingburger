'use client';

import React, { useState } from 'react';
import { Order } from '@/features/database/types/index.type';
import { MOBILE_BREAKPOINT } from '@/features/admin/constants/responsive.constants';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import styles from '@/features/admin/styles/Modal.module.css';

interface OrderNotesProps {
  order: Order;
  onNotesChange: (orderId: string, notes: string) => void;
  updating: boolean;
}

export const OrderNotes: React.FC<OrderNotesProps> = ({
  order,
  onNotesChange,
  updating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(order.internalNotes || EMPTY_STRING);
  const [isMobile, setIsMobile] = useState(false);
  const orderId = order._id?.toString() || EMPTY_STRING;

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSave = () => {
    onNotesChange(orderId, notes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotes(order.internalNotes || EMPTY_STRING);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={{ marginTop: '16px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <div className={styles.formGroup}>
          <label className={styles.label} style={{ fontSize: '0.75rem', color: '#666' }}>
            Notas Internas (Solo visible para staff)
          </label>
          <textarea
            className={styles.textarea}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Agregar notas sobre este pedido..."
            style={{ minHeight: isMobile ? 100 : 80 }}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={handleCancel}
              style={{ minHeight: isMobile ? 44 : 36 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginRight: '4px' }}>cancel</span>
              Cancelar
            </button>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleSave}
              disabled={updating}
              style={{ minHeight: isMobile ? 44 : 36 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginRight: '4px' }}>save</span>
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '16px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#135bec' }}>note</span>
          <label className={styles.label} style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
            Notas Internas
          </label>
        </div>
        <button
          className={styles.closeButton}
          onClick={() => setIsEditing(true)}
          style={{ minWidth: isMobile ? 44 : 40, minHeight: isMobile ? 44 : 40 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit</span>
        </button>
      </div>
      {order.internalNotes ? (
        <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap', marginTop: '8px', color: '#111318' }}>
          {order.internalNotes}
        </p>
      ) : (
        <p style={{ fontSize: '0.875rem', fontStyle: 'italic', marginTop: '8px', color: '#666' }}>
          No hay notas para este pedido
        </p>
      )}
    </div>
  );
};
