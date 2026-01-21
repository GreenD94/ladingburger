'use client';

import React, { useState } from 'react';
import { AdminDetail } from '@/features/admins/actions/getAdminById.action';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import styles from '@/features/admins/styles/ResetPasswordModal.module.css';

interface ResetPasswordModalProps {
  admin: AdminDetail;
  onClose: () => void;
  onReset: (newPassword: string) => Promise<string>;
}

export function ResetPasswordModal({ admin, onClose, onReset }: ResetPasswordModalProps) {
  const { t } = useLanguage();
  const [password, setPassword] = useState<string>(EMPTY_STRING);
  const [confirmPassword, setConfirmPassword] = useState<string>(EMPTY_STRING);
  const [error, setError] = useState<string>(EMPTY_STRING);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(EMPTY_STRING);

    if (password.length < 6) {
      setError(t('passwordMinLength'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    const result = await onReset(password);
    setLoading(false);

    if (result !== EMPTY_STRING) {
      setError(result);
    } else {
      onClose();
      setPassword(EMPTY_STRING);
      setConfirmPassword(EMPTY_STRING);
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
          <h2 className={styles.modalTitle}>{t('resetPassword')}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label={t('close')}>
            <span className={`material-symbols-outlined ${styles.closeIcon}`}>close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              {t('newPassword')} *
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(EMPTY_STRING);
              }}
              placeholder={t('passwordPlaceholder')}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              {t('confirmPassword')} *
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(EMPTY_STRING);
              }}
              placeholder={t('confirmPasswordPlaceholder')}
              required
              disabled={loading}
              minLength={6}
            />
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
              {loading ? t('resetting') : t('reset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

