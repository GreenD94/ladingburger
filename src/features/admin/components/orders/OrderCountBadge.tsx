'use client';

import { Box, Typography, Badge } from '@mui/material';
import { OrderStatusType } from '@/features/database/types';

interface OrderCountBadgeProps {
  count: number;
  status: OrderStatusType;
  onClick?: () => void;
}

export function OrderCountBadge({ count, status, onClick }: OrderCountBadgeProps) {
  const getStatusColor = (status: OrderStatusType) => {
    switch (status) {
      case 1: return '#FFB74D'; // WAITING_PAYMENT
      case 2: return '#FF5722'; // COOKING
      case 3: return '#4CAF50'; // IN_TRANSIT
      case 4: return '#2196F3'; // WAITING_PICKUP
      case 5: return '#4CAF50'; // COMPLETED
      case 6: return '#F44336'; // ISSUE
      default: return '#9E9E9E';
    }
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: getStatusColor(status),
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? {
          transform: 'scale(1.1)',
        } : {},
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
        }}
      >
        {count}
      </Typography>
    </Box>
  );
} 