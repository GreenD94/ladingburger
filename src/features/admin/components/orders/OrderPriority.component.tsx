'use client';

import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
} from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { Order } from '@/features/database/types/index.type';

export type OrderPriority = 'normal' | 'high' | 'urgent';

interface OrderPriorityProps {
  order: Order;
  onPriorityChange: (orderId: string, priority: OrderPriority) => void;
  updating?: boolean;
}

const priorityConfig = {
  normal: {
    label: 'Normal',
    color: 'default' as const,
    icon: undefined,
  },
  high: {
    label: 'Alta',
    color: 'warning' as const,
    icon: <PriorityHighIcon fontSize="small" />,
  },
  urgent: {
    label: 'Urgente',
    color: 'error' as const,
    icon: <PriorityHighIcon fontSize="small" />,
  },
};

export const OrderPriorityComponent: React.FC<OrderPriorityProps> = ({
  order,
  onPriorityChange,
  updating = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentPriority = (order.priority || 'normal') as OrderPriority;
  const orderId = order._id?.toString() || '';

  const handleChange = (event: SelectChangeEvent<OrderPriority>) => {
    const newPriority = event.target.value as OrderPriority;
    onPriorityChange(orderId, newPriority);
  };

  return (
    <Box>
      <FormControl fullWidth size={isMobile ? 'medium' : 'small'} disabled={updating}>
        <InputLabel>Prioridad</InputLabel>
        <Select
          value={currentPriority}
          onChange={handleChange}
          label="Prioridad"
          sx={{ minHeight: isMobile ? 48 : 40 }}
        >
          {Object.entries(priorityConfig).map(([key, config]) => (
            <MenuItem key={key} value={key}>
              <Stack direction="row" spacing={1} alignItems="center">
                {config.icon}
                <span>{config.label}</span>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {currentPriority !== 'normal' && (
        <Box sx={{ mt: 1 }}>
          <Chip
            icon={priorityConfig[currentPriority].icon || undefined}
            label={priorityConfig[currentPriority].label}
            color={priorityConfig[currentPriority].color}
            size="small"
            sx={{ minHeight: isMobile ? 32 : 24 }}
          />
        </Box>
      )}
    </Box>
  );
};

