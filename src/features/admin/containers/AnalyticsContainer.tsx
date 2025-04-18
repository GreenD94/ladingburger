'use client';

import { useState, useCallback } from 'react';
import { TimeRange } from '@/features/analytics/utils/dataAggregation';
import { Box, Typography, Alert } from '@mui/material';
import AnalyticsControls from '../components/AnalyticsControls';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function AnalyticsContainer() {
  const [timeRange, setTimeRange] = useState<number>(7);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [aggregationRange, setAggregationRange] = useState<TimeRange>('daily');
  const [error, setError] = useState<string | null>(null);

  const handleTimeRangeChange = useCallback((days: number) => {
    setError(null);
    setTimeRange(days);
  }, []);

  const handleDateChange = useCallback((date: Date | null) => {
    if (!date) {
      setError('Por favor seleccione una fecha válida');
      return;
    }
    if (date > new Date()) {
      setError('La fecha seleccionada no puede ser en el futuro');
      return;
    }
    setError(null);
    setSelectedDate(date);
  }, []);

  const handleAggregationChange = useCallback((range: TimeRange) => {
    setAggregationRange(range);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Análisis
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <AnalyticsControls
        timeRange={timeRange}
        selectedDate={selectedDate}
        onTimeRangeChange={handleTimeRangeChange}
        onDateChange={handleDateChange}
        onAggregationChange={handleAggregationChange}
      />

      <AnalyticsDashboard
        timeRange={timeRange}
        selectedDate={selectedDate}
        aggregationRange={aggregationRange}
      />
    </Box>
  );
} 