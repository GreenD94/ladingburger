'use client';

import React from 'react';
import { Box } from '@mui/material';
import { TopBar } from '@/features/landing/components/TopBar';
import { OrdersContainer } from '@/features/orders/container/Orders.container';

export default function OrdersPage() {
  return (
    <Box>
      <TopBar />
      <Box sx={{ pt: 8 }}>
        <OrdersContainer />
      </Box>
    </Box>
  );
} 