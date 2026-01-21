'use client';

import { useCallback, useMemo } from 'react';
import { TimeRange } from '@/features/analytics/utils/dataAggregation.util';
import { PillSelect } from '@/features/shared/components/PillSelect.component';
import { PillSelectOption } from '@/features/shared/types/pillSelect.type';
import styles from '@/features/admin/styles/AnalyticsControls.module.css';

const VALID_TIME_RANGES = [7, 30, 90, 180, 365];
const DAYS_7 = 7;
const DAYS_30 = 30;

interface AnalyticsControlsProps {
  timeRange: number;
  selectedDate: Date;
  onTimeRangeChange: (days: number) => void;
  onDateChange: (date: Date) => void;
  onAggregationChange: (range: TimeRange) => void;
}

const TIME_RANGE_OPTIONS: PillSelectOption[] = [
  { id: '7', label: 'Últimos 7 Días', value: '7' },
  { id: '30', label: 'Últimos 30 Días', value: '30' },
  { id: '90', label: 'Últimos 90 Días', value: '90' },
  { id: '180', label: 'Últimos 6 Meses', value: '180' },
  { id: '365', label: 'Último Año', value: '365' },
];

export default function AnalyticsControls({
  timeRange,
  selectedDate,
  onTimeRangeChange,
  onDateChange,
  onAggregationChange,
}: AnalyticsControlsProps) {
  const selectedTimeRange = useMemo(() => [timeRange.toString()], [timeRange]);

  const handleTimeRangeChange = useCallback((selectedValues: string[]) => {
    if (selectedValues.length === 0) return;
    const days = parseInt(selectedValues[0]);
    if (!VALID_TIME_RANGES.includes(days)) return;
    
    onTimeRangeChange(days);
    if (days <= DAYS_7) {
      onAggregationChange('daily');
    } else if (days <= DAYS_30) {
      onAggregationChange('weekly');
    } else {
      onAggregationChange('monthly');
    }
  }, [onTimeRangeChange, onAggregationChange]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (!dateValue) return;
    
    const newDate = new Date(dateValue);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (newDate > today) return;
    
    onDateChange(newDate);
  }, [onDateChange]);

  const dateInputValue = selectedDate.toISOString().split('T')[0];
  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.controls}>
      <div className={styles.controlGroup}>
        <label className={styles.label}>Rango de Tiempo</label>
        <PillSelect
          options={TIME_RANGE_OPTIONS}
          selectedValues={selectedTimeRange}
          onSelectionChange={handleTimeRangeChange}
          multiple={false}
          searchable={false}
          maxVisible={5}
          placeholder="Seleccionar rango..."
        />
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.label}>Fecha para Horas Pico</label>
        <input
          type="date"
          className={styles.dateInput}
          value={dateInputValue}
          onChange={handleDateChange}
          max={maxDate}
        />
      </div>
    </div>
  );
}
