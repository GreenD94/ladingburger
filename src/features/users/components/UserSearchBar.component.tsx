'use client';

import React from 'react';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/users/styles/UserSearchBar.module.css';

interface UserSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFiltersClick?: () => void;
  hasActiveFilters?: boolean;
}

export function UserSearchBar({ searchQuery, onSearchChange, onFiltersClick, hasActiveFilters = false }: UserSearchBarProps) {
  const { t } = useLanguage();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleFiltersClick = () => {
    if (onFiltersClick) {
      onFiltersClick();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t('nameOrPhone')}
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
      <button 
        className={`${styles.filterButton} ${hasActiveFilters ? styles.filterButtonActive : ''}`} 
        aria-label={t('filters')}
        onClick={handleFiltersClick}
      >
        <span className={`material-symbols-outlined ${styles.filterIcon}`}>tune</span>
        <span className={styles.filterText}>{t('filters')}</span>
        {hasActiveFilters && <span className={styles.filterBadge}></span>}
      </button>
    </div>
  );
}

