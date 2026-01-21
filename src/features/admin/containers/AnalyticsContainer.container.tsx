'use client';

import { useState, useCallback } from 'react';
import { TimeRange } from '@/features/analytics/utils/dataAggregation.util';
import { SafeArea } from '@/features/shared/components/SafeArea.component';
import { AnalyticsCategoryNav } from '@/features/analytics/components/AnalyticsCategoryNav.component';
import AnalyticsControls from '../components/AnalyticsControls.component';
import AnalyticsDashboard from '../components/AnalyticsDashboard.component';
import { useAnalyticsCategories } from '@/features/analytics/hooks/useAnalyticsCategories.hook';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import styles from '@/features/admin/styles/AnalyticsContainer.module.css';

export default function AnalyticsContainer() {
  const [timeRange, setTimeRange] = useState<number>(7);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [aggregationRange, setAggregationRange] = useState<TimeRange>('daily');
  const [error, setError] = useState<string>(EMPTY_STRING);
  
  const { selectedCategory, changeCategory } = useAnalyticsCategories();

  const handleTimeRangeChange = useCallback((days: number) => {
    setError(EMPTY_STRING);
    setTimeRange(days);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    if (date.getTime() === 0) {
      setError('Por favor seleccione una fecha válida');
      return;
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      setError('La fecha seleccionada no puede ser en el futuro');
      return;
    }
    setError(EMPTY_STRING);
    setSelectedDate(date);
  }, []);

  const handleAggregationChange = useCallback((range: TimeRange) => {
    setAggregationRange(range);
  }, []);

  const hasError = error !== EMPTY_STRING;

  return (
    <SafeArea className={styles.container} sides="all">
      <header className={styles.header}>
        <h1 className={styles.title}>Panel de Análisis</h1>

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
        selectedCategory={selectedCategory}
        onCategoryChange={changeCategory}
      />

      <main className={styles.main}>
        <AnalyticsDashboard
          timeRange={timeRange}
          selectedDate={selectedDate}
          aggregationRange={aggregationRange}
          selectedCategory={selectedCategory}
        />
        <div className={styles.spacer}></div>
      </main>
    </SafeArea>
  );
}
