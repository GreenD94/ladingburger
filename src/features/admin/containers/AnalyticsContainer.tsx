'use client';

import { useState, useCallback } from 'react';
import { TimeRange } from '@/features/analytics/utils/dataAggregation';
import { Box, Typography, Alert, useTheme, useMediaQuery } from '@mui/material';
import AnalyticsControls from '../components/AnalyticsControls';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function AnalyticsContainer() {
  const [timeRange, setTimeRange] = useState<number>(7);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [aggregationRange, setAggregationRange] = useState<TimeRange>('daily');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Box 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          bgcolor: 'background.paper',
          p: { xs: 2, sm: 3 },
          pb: { xs: 1, sm: 2 }
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem' },
            mb: { xs: 1, sm: 2 }
          }}
        >
          Panel de Análisis
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
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
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 2, sm: 3 },
          pt: { xs: 1, sm: 2 },
          pb: { xs: 4, sm: 3 }
        }}
      >
        <AnalyticsDashboard
          timeRange={timeRange}
          selectedDate={selectedDate}
          aggregationRange={aggregationRange}
        />
      </Box>
      <Box
        height={300}></Box>      
    </Box>
  );
} 