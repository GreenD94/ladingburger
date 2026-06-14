'use client';

import { useState } from 'react';
import { MaterialsContainer } from './MaterialsContainer.container';
import { BillsContainer } from './BillsContainer.container';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import styles from '../styles/InventoryContainer.module.css';

type TabValue = 'materials' | 'bills';

export function InventoryContainer() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabValue>('materials');

  const handleTabChange = (newValue: TabValue) => {
    setActiveTab(newValue);
  };

  return (
    <SafeArea sides="all">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('inventory')}</h1>
        </div>

        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'materials' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('materials')}
            type="button"
          >
            {t('materials')}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'bills' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('bills')}
            type="button"
          >
            {t('bills')}
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'materials' && <MaterialsContainer />}
          {activeTab === 'bills' && <BillsContainer />}
        </div>
      </div>
    </SafeArea>
  );
}
