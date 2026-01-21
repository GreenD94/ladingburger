'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ANALYTICS_CATEGORIES } from '@/features/analytics/constants/analyticsCategories.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/analytics/styles/AnalyticsOverview.module.css';

export function AnalyticsOverview() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/admin/analytics/${categoryId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('analyticsDashboard')}</h1>
        <p className={styles.subtitle}>{t('analyticsDashboardDescription')}</p>
      </div>

      <div className={styles.categoriesGrid}>
        {ANALYTICS_CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={styles.categoryCard}
            onClick={() => handleCategoryClick(category.id)}
            aria-label={t(`analyticsCategory${category.id.charAt(0).toUpperCase() + category.id.slice(1)}`)}
          >
            <div className={styles.categoryIcon}>
              <span className={`material-symbols-outlined ${styles.icon}`}>{category.icon}</span>
            </div>
            <div className={styles.categoryContent}>
              <h2 className={styles.categoryTitle}>
                {t(`analyticsCategory${category.id.charAt(0).toUpperCase() + category.id.slice(1)}`)}
              </h2>
              <p className={styles.categoryDescription}>
                {t(`analyticsCategory${category.id.charAt(0).toUpperCase() + category.id.slice(1)}Description`)}
              </p>
            </div>
            <span className={`material-symbols-outlined ${styles.arrowIcon}`}>arrow_forward</span>
          </button>
        ))}
      </div>
    </div>
  );
}

