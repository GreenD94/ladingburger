'use client';

import React from 'react';
import { AdminDetail } from '@/features/admins/actions/getAdminById.action';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admins/styles/AdminDetailHeader.module.css';

interface AdminDetailHeaderProps {
  admin: AdminDetail;
  onBack: () => void;
}

export function AdminDetailHeader({ admin, onBack }: AdminDetailHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={onBack} aria-label={t('back')}>
          <span className={`material-symbols-outlined ${styles.backIcon}`}>arrow_back</span>
        </button>
        <h2 className={styles.title}>{t('adminProfile')}</h2>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.avatarContainer}>
          <span className={`material-symbols-outlined ${styles.avatarIcon}`}>admin_panel_settings</span>
          {admin.isEnabled && (
            <div className={styles.badge}>
              {t('active')}
            </div>
          )}
        </div>
        <div className={styles.adminInfo}>
          <h1 className={styles.adminEmail}>{admin.email}</h1>
          <p className={styles.status}>
            {admin.isEnabled ? t('enabled') : t('disabled')}
          </p>
        </div>
      </div>
    </header>
  );
}

