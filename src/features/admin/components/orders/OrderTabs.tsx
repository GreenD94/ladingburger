'use client';

import { Tabs, Tab, Box } from '@mui/material';
import { OrderStatus, OrderStatusType } from '@/features/database/types';
import { OrderStatusLabels } from '@/features/database/types';
import { OrderCountBadge } from './OrderCountBadge';

interface OrderTabsProps {
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  orderCounts: Record<OrderStatusType, number>;
}

const getStatusColor = (status: OrderStatusType) => {
  switch (status) {
    case OrderStatus.WAITING_PAYMENT:
      return '#FFB74D'; // Orange
    case OrderStatus.COOKING:
      return '#FF5722'; // Deep Orange
    case OrderStatus.IN_TRANSIT:
      return '#4CAF50'; // Green
    case OrderStatus.WAITING_PICKUP:
      return '#2196F3'; // Blue
    case OrderStatus.COMPLETED:
      return '#4CAF50'; // Green
    case OrderStatus.ISSUE:
      return '#F44336'; // Red
    default:
      return '#9E9E9E'; // Grey
  }
};

export function OrderTabs({ activeTab, onTabChange, orderCounts }: OrderTabsProps) {
  return (
    <Box sx={{ 
      width: '100%',
      bgcolor: 'background.paper',
      borderRadius: 1,
      overflow: 'hidden',
      boxShadow: 1
    }}>
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 'medium',
            minWidth: 'auto',
            px: 3,
            py: 1.5,
            color: 'text.primary',
            opacity: 0.7,
            transition: 'all 0.2s',
            '&.Mui-selected': {
              fontWeight: 'bold',
              opacity: 1,
            },
          },
        }}
      >
        {Object.values(OrderStatus).map((status, index) => (
          <Tab
            key={status}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {OrderStatusLabels[status]}
                <OrderCountBadge count={orderCounts[status]} status={status} />
              </Box>
            }
            sx={{
              backgroundColor: getStatusColor(status),
              '&.Mui-selected': {
                backgroundColor: getStatusColor(status),
                color: 'white',
                boxShadow: 2,
              },
              '&:hover': {
                backgroundColor: getStatusColor(status),
                opacity: 0.9,
                color: 'white',
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
} 