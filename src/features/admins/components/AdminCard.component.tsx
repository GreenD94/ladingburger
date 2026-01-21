'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminListItem } from '@/features/admins/actions/getAdmins.action';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { formatDate } from '@/features/users/utils/dateFormat.util';
import styles from '@/features/admins/styles/AdminCard.module.css';

interface AdminCardProps {
  admin: AdminListItem;
}

export function AdminCard({ admin }: AdminCardProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (admin._id) {
      router.push(`/admin/admins/${admin._id}`);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.adminInfo}>
          <h3 className={styles.adminEmail}>{admin.email}</h3>
          <div className={styles.statusRow}>
            <span
              className={`${styles.statusBadge} ${admin.isEnabled ? styles.statusEnabled : styles.statusDisabled}`}
            >
              {admin.isEnabled ? t('enabled') : t('disabled')}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.createdText}>
          {t('createdAt')}: {formatDate(admin.createdAt)}
        </span>
      </div>

      <div className={styles.actionsRow}>
        <button
          className={`${styles.actionButton} ${styles.detailButton}`}
          onClick={handleDetailClick}
          aria-label={t('viewDetails')}
        >
          <span className={`material-symbols-outlined ${styles.actionIcon}`}>visibility</span>
          <span className={styles.actionText}>{t('details')}</span>
        </button>
      </div>
    </div>
  );
}

