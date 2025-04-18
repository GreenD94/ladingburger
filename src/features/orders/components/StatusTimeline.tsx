'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { OrderLog, OrderStatus } from '@/features/database/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Define status colors for visual distinction
const statusColors = {
  [OrderStatus.WAITING_PAYMENT]: '#FFB74D', // Warm orange for waiting
  [OrderStatus.COOKING]: '#FF5722', // Hot orange for cooking
  [OrderStatus.IN_TRANSIT]: '#4CAF50', // Green for movement
  [OrderStatus.WAITING_PICKUP]: '#2196F3', // Blue for ready state
  [OrderStatus.COMPLETED]: '#4CAF50', // Success green
  [OrderStatus.ISSUE]: '#F44336', // Red for issues
};

interface StatusTimelineProps {
  logs: OrderLog[];
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ logs }) => {
  const theme = useTheme();
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Box sx={{ position: 'relative', pl: 3, mt: 2 }}>


     
    </Box>
  );
}; 