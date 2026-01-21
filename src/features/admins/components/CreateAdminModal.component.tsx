'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import styles from '@/features/admins/styles/CreateAdminModal.module.css';

interface CreateAdminModalProps {
  onClose: () => void;
  onCreate: (email: string, password: string) => Promise<string>;
}

export function CreateAdminModal({ onClose, onCreate }: CreateAdminModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState<string>(EMPTY_STRING);
  const [password, setPassword] = useState<string>(EMPTY_STRING);
  const [confirmPassword, setConfirmPassword] = useState<string>(EMPTY_STRING);
  const [error, setError] = useState<string>(EMPTY_STRING);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(EMPTY_STRING);

    if (email.trim() === EMPTY_STRING) {
      setError(t('emailRequired'));
      return;
    }

    if (password.length < 6) {
      setError(t('passwordMinLength'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    const result = await onCreate(email.trim(), password);
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
          <h2 className={styles.modalTitle}>{t('createAdmin')}</h2>
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
            <label className={styles.label} htmlFor="password">
              {t('password')} *
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
              {loading ? t('creating') : t('create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

