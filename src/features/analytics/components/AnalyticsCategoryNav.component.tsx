'use client';

import React from 'react';
import { AnalyticsCategoryId, ANALYTICS_CATEGORIES } from '@/features/analytics/constants/analyticsCategories.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/analytics/styles/AnalyticsCategoryNav.module.css';

interface AnalyticsCategoryNavProps {
  selectedCategory: AnalyticsCategoryId;
  onCategoryChange: (categoryId: AnalyticsCategoryId) => void;
}

export function AnalyticsCategoryNav({ selectedCategory, onCategoryChange }: AnalyticsCategoryNavProps) {
  const { t } = useLanguage();

  return (
    <nav className={styles.nav} role="tablist">
      <div className={styles.scrollContainer}>
        {ANALYTICS_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          const categoryKey = `analyticsCategory${category.id.charAt(0).toUpperCase() + category.id.slice(1)}`;
          return (
            <button
              key={category.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`category-${category.id}`}
              className={`${styles.categoryButton} ${isSelected ? styles.categoryButtonSelected : ''}`}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className={`material-symbols-outlined ${styles.categoryIcon}`}>
                {category.icon}
              </span>
              <span className={styles.categoryLabel}>{t(categoryKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

