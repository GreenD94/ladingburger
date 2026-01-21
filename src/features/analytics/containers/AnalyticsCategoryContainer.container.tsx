'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TimeRange } from '@/features/analytics/utils/dataAggregation.util';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import { AnalyticsCategoryNav } from '@/features/analytics/components/AnalyticsCategoryNav.component';
import AnalyticsControls from '@/features/admin/components/AnalyticsControls.component';
import AnalyticsDashboard from '@/features/admin/components/AnalyticsDashboard.component';
import { getCategoryById, AnalyticsCategoryId } from '@/features/analytics/constants/analyticsCategories.constants';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admin/styles/AnalyticsContainer.module.css';

export default function AnalyticsCategoryContainer() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const categoryParam = typeof params.category === 'string' ? params.category : EMPTY_STRING;
  
  const category = getCategoryById(categoryParam as AnalyticsCategoryId);
  const [timeRange, setTimeRange] = useState<number>(7);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [aggregationRange, setAggregationRange] = useState<TimeRange>('daily');
  const [error, setError] = useState<string>(EMPTY_STRING);

  const handleTimeRangeChange = useCallback((days: number) => {
    setError(EMPTY_STRING);
    setTimeRange(days);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    if (date.getTime() === 0) {
      setError(t('invalidDate'));
      return;
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      setError(t('dateCannotBeFuture'));
      return;
    }
    setError(EMPTY_STRING);
    setSelectedDate(date);
  }, [t]);

  const handleAggregationChange = useCallback((range: TimeRange) => {
    setAggregationRange(range);
  }, []);

  const handleCategoryChange = useCallback((newCategory: AnalyticsCategoryId) => {
    router.push(`/admin/analytics/${newCategory}`);
  }, [router]);

  const handleBack = useCallback(() => {
    router.push('/admin/analytics');
  }, [router]);

  const hasError = error !== EMPTY_STRING;

  return (
    <SafeArea className={styles.container} sides="all">
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backButton} onClick={handleBack} aria-label={t('back')}>
            <span className={`material-symbols-outlined ${styles.backIcon}`}>arrow_back</span>
          </button>
          <h1 className={styles.title}>
            {t(`analyticsCategory${category.id.charAt(0).toUpperCase() + category.id.slice(1)}`)}
          </h1>
        </div>

        {hasError && (
          <div className={styles.errorAlert}>
            <span className={`material-symbols-outlined ${styles.errorIcon}`}>error</span>
            <span className={styles.errorText}>{error}</span>
          </div>
        )}

        <AnalyticsControls
          timeRange={timeRange}
          selectedDate={selectedDate}
          onTimeRangeChange={handleTimeRangeChange}
          onDateChange={handleDateChange}
          onAggregationChange={handleAggregationChange}
        />
      </header>

      <AnalyticsCategoryNav
        selectedCategory={category.id}
        onCategoryChange={handleCategoryChange}
      />

      <main className={styles.main}>
        <AnalyticsDashboard
          timeRange={timeRange}
          selectedDate={selectedDate}
          aggregationRange={aggregationRange}
          selectedCategory={category.id}
        />
        <div className={styles.spacer}></div>
      </main>
    </SafeArea>
  );
}

