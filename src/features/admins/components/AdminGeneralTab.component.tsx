'use client';

import React from 'react';
import { AdminDetail } from '@/features/admins/actions/getAdminById.action';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { formatDate, formatDateWithTime } from '@/features/users/utils/dateFormat.util';
import styles from '@/features/admins/styles/AdminGeneralTab.module.css';

interface AdminGeneralTabProps {
  admin: AdminDetail;
}

export function AdminGeneralTab({ admin }: AdminGeneralTabProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.content}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('accountInformation')}</h3>
        
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>{t('email')}</label>
            <p className={styles.infoValue}>{admin.email}</p>
          </div>

          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>{t('status')}</label>
            <p className={styles.infoValue}>
              <span
                className={`${styles.statusBadge} ${admin.isEnabled ? styles.statusEnabled : styles.statusDisabled}`}
              >
                {admin.isEnabled ? t('enabled') : t('disabled')}
              </span>
            </p>
          </div>

          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>{t('createdAt')}</label>
            <p className={styles.infoValue}>{formatDateWithTime(admin.createdAt)}</p>
          </div>

          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>{t('lastUpdated')}</label>
            <p className={styles.infoValue}>{formatDateWithTime(admin.updatedAt)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

