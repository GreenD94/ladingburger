'use client';

import React from 'react';
import { Box } from '@mui/material';
import { TopBar } from '@/features/landing/components/TopBar.component';
import { OrderForm } from '../components/OrderForm.component';

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