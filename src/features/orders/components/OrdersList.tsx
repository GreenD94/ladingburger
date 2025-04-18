'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Order } from '@/features/database/types';

import { useBurgers } from '../hooks/useBurgers';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import OrderCard from './OrderCard';

interface OrdersListProps {
  orders: Order[];
  isLoading: boolean;
}

export const OrdersList: React.FC<OrdersListProps> = ({ orders, isLoading }) => {
  const theme = useTheme();
  const { burgers, loading: burgersLoading, error: burgersError } = useBurgers();

  if (isLoading || burgersLoading) {
    return <LoadingState />;
  }

  if (burgersError) {
    return <ErrorState message="Error al cargar las hamburguesas" />;
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            mb: 2,
            fontWeight: 'bold',
          }}
        >
          No hay pedidos registrados
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          No encontramos pedidos asociados a este número de teléfono. 
          Realiza tu primer pedido y podrás verlo aquí.
        </Typography>
      </Box>
    );
  }

  // Convert burgers map to array
  const burgersArray = Object.values(burgers);

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.text.primary,
          mb: 4,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Tus Pedidos
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {orders.map((order, index) => (
          <motion.div
            key={order._id?.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <OrderCard 
              order={order} 
              orderNumber={ index+1} 
              burgers={burgersArray}
            />
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}; 