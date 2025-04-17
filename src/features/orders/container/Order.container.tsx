'use client';

import React from 'react';
import { Box } from '@mui/material';
import { TopBar } from '@/features/landing/components/TopBar';
import { OrderForm } from '../components/OrderForm';

export const OrderContainer: React.FC = () => {
  return (
    <Box>
      <TopBar />
      <Box sx={{ pt: 8 }}>
        <OrderForm />
      </Box>
    </Box>
  );
}; 