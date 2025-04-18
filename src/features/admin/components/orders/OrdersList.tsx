'use client';

import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Order, OrderStatusType, Burger } from '@/features/database/types';
import { updateOrderStatus } from '@/features/database/actions/orders/updateOrderStatus';
import { useBurgers } from '@/features/orders/hooks/useBurgers';
import LoadingState from '@/features/analytics/components/LoadingState';
import ErrorState from '@/features/analytics/components/ErrorState';
import { OrderCard } from './OrderCard';

interface OrdersListProps {
  orders: Order[];
  onStatusChange: () => void;
  onPaymentUpdate: () => void;
}

export default function OrdersList({ orders, onStatusChange, onPaymentUpdate }: OrdersListProps) {
  const { burgers, loading: burgersLoading, error: burgersError } = useBurgers();
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

  const getBurgerName = (burgerId: string) => {
    const burger = burgers[burgerId] as Burger | undefined;
    return burger?.name || 'Hamburguesa no encontrada';
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatusType) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      await updateOrderStatus(orderId, newStatus);
      onStatusChange();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (burgersLoading) {
    return <LoadingState title="Cargando productos..." />;
  }

  if (burgersError) {
    return <ErrorState error={burgersError} onRetry={() => window.location.reload()} />;
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay órdenes en este estado
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {orders.map((order) => (
        <OrderCard
          key={order._id?.toString()}
          order={order}
          onStatusChange={handleStatusChange}
          updatingStatus={updatingStatus}
          getBurgerName={getBurgerName}
          onPaymentUpdate={onPaymentUpdate}
        />
      ))}
    </Stack>
  );
} 