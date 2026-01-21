'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserWithStats } from '@/features/users/actions/getUsersWithStats.action';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { formatRelativeDate } from '@/features/users/utils/dateFormat.util';
import styles from '@/features/users/styles/UserCard.module.css';

interface UserCardProps {
  user: UserWithStats;
  etiquetasMap?: Record<string, string>;
}

function generateWhatsAppLink(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}`;
}

export function UserCard({ user, etiquetasMap = {} }: UserCardProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const displayName = user.name || user.phoneNumber || t('noName');
  const displayPhone = user.phoneNumber || EMPTY_STRING;
  const userTags = user.tags || [];

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user._id) {
      router.push(`/admin/users/${user._id}`);
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (displayPhone && displayPhone !== EMPTY_STRING) {
      const whatsappLink = generateWhatsAppLink(displayPhone);
      window.open(whatsappLink, '_blank');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{displayName}</h3>
          <p className={styles.userPhone}>
            <span className={`material-symbols-outlined ${styles.phoneIcon}`}>call</span>
            {displayPhone}
          </p>
        </div>
      </div>

      {userTags.length > 0 && (
        <div className={styles.tagsContainer}>
          {userTags.map((tag, index) => {
            const tagColor = etiquetasMap[tag] || '#135bec';
            return (
              <span
                key={index}
                className={styles.tag}
                style={{
                  backgroundColor: `${tagColor}20`,
                  color: tagColor,
                  borderColor: `${tagColor}40`,
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <p className={styles.statLabel}>{t('totalOrders')}</p>
          <p className={styles.statValue}>{user.stats.totalOrders}</p>
        </div>
        <div className={styles.statItem}>
          <p className={styles.statLabel}>{t('ltvSales')}</p>
          <p className={`${styles.statValue} ${styles.statValuePrimary}`}>
            ${user.stats.lifetimeValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.lastOrderText}>
          {t('lastOrder')}: {formatRelativeDate(user.stats.lastOrderDate)}
        </span>
      </div>

      <div className={styles.actionsRow}>
        <button
          className={`${styles.actionButton} ${styles.whatsappButton}`}
          onClick={handleWhatsAppClick}
          aria-label={t('openWhatsApp')}
        >
          <span className={`material-symbols-outlined ${styles.actionIcon}`}>chat</span>
          <span className={styles.actionText}>{t('whatsapp')}</span>
        </button>
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

