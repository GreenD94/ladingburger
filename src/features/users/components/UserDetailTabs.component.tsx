'use client';

import React from 'react';
import styles from '@/features/users/styles/UserDetailTabs.module.css';

type TabType = 'general' | 'stats' | 'history';

interface UserDetailTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function UserDetailTabs({ activeTab, onTabChange }: UserDetailTabsProps) {
  return (
    <div className={styles.tabsContainer}>
      <button
        className={`${styles.tab} ${activeTab === 'general' ? styles.tabActive : ''}`}
        onClick={() => onTabChange('general')}
      >
        <span className={styles.tabText}>General</span>
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'stats' ? styles.tabActive : ''}`}
        onClick={() => onTabChange('stats')}
      >
        <span className={styles.tabText}>Estadísticas</span>
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
        onClick={() => onTabChange('history')}
      >
        <span className={styles.tabText}>Historial</span>
      </button>
    </div>
  );
}

