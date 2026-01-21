'use client';

import React, { useState, useEffect } from 'react';
import { Etiqueta } from '@/features/database/types/etiqueta.type';
import styles from '@/features/etiquetas/styles/EtiquetaModal.module.css';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

interface EditEtiquetaModalProps {
  etiqueta: Etiqueta;
  onClose: () => void;
  onUpdate: (id: string, name: string, color: string) => Promise<string>;
}

const DEFAULT_COLORS = [
  '#135bec',
  '#10B981',
  '#EF4444',
  '#EAB308',
  '#8B5CF6',
  '#F97316',
  '#06B6D4',
  '#EC4899',
];

export function EditEtiquetaModal({ etiqueta, onClose, onUpdate }: EditEtiquetaModalProps) {
  const [name, setName] = useState<string>(etiqueta.name);
  const [color, setColor] = useState<string>(etiqueta.color);
  const [error, setError] = useState<string>(EMPTY_STRING);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(etiqueta.name);
    setColor(etiqueta.color);
  }, [etiqueta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(EMPTY_STRING);

    if (name.trim() === EMPTY_STRING) {
      setError('El nombre es requerido');
      return;
    }

    if (!etiqueta._id) {
      setError('ID de etiqueta inválido');
      return;
    }

    const finalName = etiqueta.isSystemManaged ? etiqueta.name : name.trim();

    setLoading(true);
    const errorMessage = await onUpdate(etiqueta._id.toString(), finalName, color);
    setLoading(false);

    if (errorMessage !== EMPTY_STRING) {
      setError(errorMessage);
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
          <h2 className={styles.modalTitle}>Editar Etiqueta</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>

        <form className={styles.modalContent} onSubmit={handleSubmit}>
          {error !== EMPTY_STRING && (
            <div className={styles.errorAlert}>
              <span className={`material-symbols-outlined ${styles.errorIcon}`}>error</span>
              <span className={styles.errorText}>{error}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="edit-name">
              Nombre
            </label>
            <input
              id="edit-name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: VIP, Nuevo Cliente, etc."
              required
              disabled={loading || etiqueta.isSystemManaged}
            />
            {etiqueta.isSystemManaged && (
              <p className={styles.helpText}>
                El nombre de esta etiqueta no puede ser editado (gestionada por el sistema)
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="edit-color">
              Color
            </label>
            <div className={styles.colorPicker}>
              <input
                id="edit-color"
                type="color"
                className={styles.colorInput}
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={loading}
              />
              <div className={styles.colorPresets}>
                {DEFAULT_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    className={`${styles.colorPreset} ${color === presetColor ? styles.colorPresetActive : ''}`}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => setColor(presetColor)}
                    disabled={loading}
                    aria-label={`Seleccionar color ${presetColor}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

