'use client';

import React from 'react';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admins/styles/AdminSearchBar.module.css';

interface AdminSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function AdminSearchBar({ searchQuery, onSearchChange }: AdminSearchBarProps) {
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t('searchAdminsPlaceholder')}
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

