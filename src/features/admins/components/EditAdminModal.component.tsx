'use client';

import React, { useState } from 'react';
import { AdminDetail } from '@/features/admins/actions/getAdminById.action';
import { UpdateAdminInput } from '@/features/admins/actions/updateAdmin.action';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import styles from '@/features/admins/styles/EditAdminModal.module.css';

interface EditAdminModalProps {
  admin: AdminDetail;
  onClose: () => void;
  onUpdate: (updates: UpdateAdminInput) => Promise<string>;
}

export function EditAdminModal({ admin, onClose, onUpdate }: EditAdminModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState<string>(admin.email || EMPTY_STRING);
  const [isEnabled, setIsEnabled] = useState<boolean>(admin.isEnabled);
  const [error, setError] = useState<string>(EMPTY_STRING);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(EMPTY_STRING);

    if (email.trim() === EMPTY_STRING) {
      setError(t('emailRequired'));
      return;
    }

    setLoading(true);
    const updates: UpdateAdminInput = {
      email: email.trim(),
      isEnabled,
    };
    const result = await onUpdate(updates);
    setLoading(false);

    if (result !== EMPTY_STRING) {
      setError(result);
    } else {
      onClose();
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
          <h2 className={styles.modalTitle}>{t('editAdmin')}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label={t('close')}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              {t('email')} *
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(EMPTY_STRING);
              }}
              placeholder={t('emailPlaceholder')}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="isEnabled">
              {t('status')}
            </label>
            <div className={styles.switchContainer}>
              <button
                type="button"
                className={`${styles.switch} ${isEnabled ? styles.switchEnabled : styles.switchDisabled}`}
                onClick={() => setIsEnabled(!isEnabled)}
                disabled={loading}
              >
                <span className={styles.switchThumb}></span>
              </button>
              <span className={styles.switchLabel}>
                {isEnabled ? t('enabled') : t('disabled')}
              </span>
            </div>
          </div>

          {error !== EMPTY_STRING && (
            <div className={styles.errorMessage}>
              <span className={`material-symbols-outlined ${styles.errorIcon}`}>error</span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={onClose}
              disabled={loading}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonPrimary}`}
              disabled={loading}
            >
              {loading ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

