'use client';

import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useOrderTimer } from '@/features/admin/hooks/useOrderTimer';

interface OrderTimerProps {
  createdAt: Date | string;
}

export function OrderTimer({ createdAt }: OrderTimerProps) {
  const dateString = typeof createdAt === 'string' ? createdAt : new Date(createdAt).toISOString();
  const { timeString, color } = useOrderTimer(dateString);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
      <AccessTimeIcon 
        sx={{ 
          fontSize: '1rem', 
          mr: 0.5, 
          color: `${color}.main`
        }} 
      />
      <Typography 
        variant="body2" 
        sx={{ 
          color: `${color}.main`,
          fontWeight: 'medium',
          fontSize: '0.95rem'
        }}
      >
        {timeString}
      </Typography>
    </Box>
  );
} 