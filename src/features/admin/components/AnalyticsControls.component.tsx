'use client';

import { useCallback } from 'react';
import { TimeRange } from '@/features/analytics/utils/dataAggregation.util';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Select, MenuItem, FormControl, InputLabel, Box, SelectChangeEvent } from '@mui/material';

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

export default function AnalyticsControls({
  timeRange,
  selectedDate,
  onTimeRangeChange,
  onDateChange,
  onAggregationChange,
}: AnalyticsControlsProps) {
  const handleTimeRangeChange = useCallback((event: SelectChangeEvent<number>) => {
    const days = typeof event.target.value === 'number' ? event.target.value : parseInt(event.target.value);
    if (!VALID_TIME_RANGES.includes(days)) return;
    
    onTimeRangeChange(days);
    if (days <= DAYS_7) onAggregationChange('daily');
    else if (days <= DAYS_30) onAggregationChange('weekly');
    else onAggregationChange('monthly');
  }, [onTimeRangeChange, onAggregationChange]);

  const handleDateChange = useCallback((newValue: Date | null) => {
    if (!newValue || newValue > new Date()) return;
    onDateChange(newValue);
  }, [onDateChange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Rango de Tiempo</InputLabel>
          <Select
            value={timeRange}
            label="Rango de Tiempo"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value={7}>Últimos 7 Días</MenuItem>
            <MenuItem value={30}>Últimos 30 Días</MenuItem>
            <MenuItem value={90}>Últimos 90 Días</MenuItem>
            <MenuItem value={180}>Últimos 6 Meses</MenuItem>
            <MenuItem value={365}>Último Año</MenuItem>
          </Select>
        </FormControl>

        <DatePicker
          label="Seleccionar Fecha para Horas Pico"
          value={selectedDate}
          onChange={handleDateChange}
          maxDate={new Date()}
          sx={{ minWidth: 200 }}
        />
      </Box>
    </LocalizationProvider>
  );
}

