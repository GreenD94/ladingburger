'use client';

import { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { OrderStatus } from '@/features/database/types';
import { TabPanel } from '@/features/admin/components/orders/TabPanel';
import { OrderTabs } from '@/features/admin/components/orders/OrderTabs';
import { RefreshTimer } from '@/features/admin/components/orders/RefreshTimer';
import OrdersList from '@/features/admin/components/orders/OrdersList';
import LoadingState from '@/features/analytics/components/LoadingState';
import { useOrders } from '@/features/admin/hooks/useOrders';
import { useRefreshTimer } from '@/features/admin/hooks/useRefreshTimer';

const getStatusBackgroundColor = (status: number) => {
  switch (status) {
    case OrderStatus.WAITING_PAYMENT:
      return 'rgba(255, 183, 77, 0.1)'; // Orange with opacity
    case OrderStatus.COOKING:
      return 'rgba(255, 87, 34, 0.1)'; // Deep Orange with opacity
    case OrderStatus.IN_TRANSIT:
      return 'rgba(76, 175, 80, 0.1)'; // Green with opacity
    case OrderStatus.WAITING_PICKUP:
      return 'rgba(33, 150, 243, 0.1)'; // Blue with opacity
    case OrderStatus.COMPLETED:
      return 'rgba(76, 175, 80, 0.1)'; // Green with opacity
    case OrderStatus.ISSUE:
      return 'rgba(244, 67, 54, 0.1)'; // Red with opacity
    default:
      return 'rgba(158, 158, 158, 0.1)'; // Grey with opacity
  }
};

export default function OrdersContainer() {
  const [activeTab, setActiveTab] = useState(0);
  const { orders, loading, refetchOrders } = useOrders();
  const { timeLeft, isDisabled, handleRefresh } = useRefreshTimer({
    onRefresh: refetchOrders,
    initialTime: 30,
    cooldownTime: 10
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <LoadingState title="Cargando órdenes..." />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestión de Órdenes
        </Typography>
        <RefreshTimer
          timeLeft={timeLeft}
          isDisabled={isDisabled}
          onRefresh={handleRefresh}
        />
      </Stack>

      <OrderTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {Object.values(OrderStatus).map((status, index) => (
        <TabPanel 
          key={status} 
          value={activeTab} 
          index={index}
          sx={{
            backgroundColor: getStatusBackgroundColor(status),
            borderRadius: 2,
            p: 2,
            mt: 2,
          }}
        >
          <OrdersList 
            orders={orders[status]} 
            onStatusChange={refetchOrders}
            onPaymentUpdate={refetchOrders}
          />
        </TabPanel>
      ))}
    </Box>
  );
} 