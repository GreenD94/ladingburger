'use client';

import { Box, Typography, Badge } from '@mui/material';
import { OrderStatus, OrderStatusType } from '@/features/database/types/index.type';

interface OrderCountBadgeProps {
  count: number;
  status: OrderStatusType;
  onClick?: () => void;
}

export function OrderCountBadge({ count, status, onClick }: OrderCountBadgeProps) {
  const getStatusColor = (status: OrderStatusType) => {
    switch (status) {
      case OrderStatus.WAITING_PAYMENT: return '#FFB74D';
      case OrderStatus.PAYMENT_FAILED: return '#F44336';
      case OrderStatus.COOKING: return '#FF5722';
      case OrderStatus.IN_TRANSIT: return '#4CAF50';
      case OrderStatus.WAITING_PICKUP: return '#2196F3';
      case OrderStatus.COMPLETED: return '#4CAF50';
      case OrderStatus.ISSUE: return '#F44336';
      case OrderStatus.CANCELLED: return '#757575';
      case OrderStatus.REFUNDED: return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const hasOnClick = onClick !== undefined;

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
        cursor: hasOnClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': hasOnClick ? {
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

