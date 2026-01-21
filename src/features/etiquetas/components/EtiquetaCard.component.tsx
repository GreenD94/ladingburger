'use client';

import React from 'react';
import { Etiqueta } from '@/features/database/types/etiqueta.type';
import styles from '@/features/etiquetas/styles/EtiquetaCard.module.css';

interface EtiquetaCardProps {
  etiqueta: Etiqueta;
  onEdit: (etiqueta: Etiqueta) => void;
  onToggleEnabled: (id: string, isEnabled: boolean) => void;
}

export function EtiquetaCard({ etiqueta, onEdit, onToggleEnabled }: EtiquetaCardProps) {
  const handleToggle = () => {
    if (etiqueta._id && !etiqueta.isSystemManaged) {
      onToggleEnabled(etiqueta._id.toString(), etiqueta.isEnabled);
    }
  };

  const handleEdit = () => {
    onEdit(etiqueta);
  };

  const canToggle = !etiqueta.isSystemManaged;
  const canEdit = true;

  const isManagedBySystem = etiqueta.isSystemManaged;
  const isCreatedBySystem = etiqueta.isSystemCreated && !etiqueta.isSystemManaged;

  return (
    <div className={`${styles.card} ${!etiqueta.isEnabled ? styles.cardDisabled : ''}`}>
      <div className={styles.cardContent}>
        <div className={styles.colorIndicator} style={{ backgroundColor: etiqueta.color }}></div>
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{etiqueta.name}</h3>
          </div>
          <div className={styles.badgesRow}>
            {isManagedBySystem && (
              <span className={styles.systemBadge} title="Managed by system">
                <span className={`material-symbols-outlined ${styles.systemIcon}`}>smart_toy</span>
                <span className={styles.systemText}>Managed by system</span>
              </span>
            )}
            {isCreatedBySystem && (
              <span className={styles.seederBadge} title="Created by system">
                <span className={`material-symbols-outlined ${styles.seederIcon}`}>database</span>
                <span className={styles.seederText}>Created by system</span>
              </span>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.toggleButton}
            onClick={handleToggle}
            disabled={!canToggle}
            aria-label={etiqueta.isEnabled ? 'Deshabilitar' : 'Habilitar'}
            title={canToggle ? (etiqueta.isEnabled ? 'Deshabilitar' : 'Habilitar') : 'No se puede deshabilitar (gestionada por el sistema)'}
          >
            <span className={`material-symbols-outlined ${styles.toggleIcon}`}>
              {etiqueta.isEnabled ? 'toggle_on' : 'toggle_off'}
            </span>
          </button>
          <button
            className={styles.editButton}
            onClick={handleEdit}
            aria-label="Editar"
            title="Editar"
            disabled={!canEdit}
          >
            <span className={`material-symbols-outlined ${styles.editIcon}`}>edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

