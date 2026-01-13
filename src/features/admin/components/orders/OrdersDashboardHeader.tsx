'use client';

import React from 'react';
import { Box, Typography, Stack, Badge, IconButton, TextField, InputAdornment, ToggleButton, ToggleButtonGroup, useTheme, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { OrderStatus, OrderStatusType } from '@/features/database/types';
import { OrderStatusLabels } from '@/features/database/types';

interface OrdersDashboardHeaderProps {
  orderCounts: Record<OrderStatusType, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  quickFilter: 'all' | 'pending' | 'unpaid' | 'urgent';
  onQuickFilterChange: (filter: 'all' | 'pending' | 'unpaid' | 'urgent') => void;
  autoRefresh: boolean;
  onAutoRefreshToggle: (enabled: boolean) => void;
}

const getStatusColor = (status: OrderStatusType) => {
  switch (status) {
    case OrderStatus.WAITING_PAYMENT: return '#FFB74D';
    case OrderStatus.COOKING: return '#FF5722';
    case OrderStatus.IN_TRANSIT: return '#4CAF50';
    case OrderStatus.WAITING_PICKUP: return '#2196F3';
    case OrderStatus.COMPLETED: return '#4CAF50';
    case OrderStatus.ISSUE: return '#F44336';
    default: return '#9E9E9E';
  }
};

export const OrdersDashboardHeader: React.FC<OrdersDashboardHeaderProps> = ({
  orderCounts,
  searchQuery,
  onSearchChange,
  onRefresh,
  isRefreshing = false,
  quickFilter,
  onQuickFilterChange,
  autoRefresh,
  onAutoRefreshToggle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const totalPending = orderCounts[OrderStatus.WAITING_PAYMENT] + 
                      orderCounts[OrderStatus.COOKING] + 
                      orderCounts[OrderStatus.IN_TRANSIT] + 
                      orderCounts[OrderStatus.WAITING_PICKUP];

  const totalUnpaid = orderCounts[OrderStatus.WAITING_PAYMENT];

  const totalUrgent = orderCounts[OrderStatus.ISSUE];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Title and Refresh */}
      <Stack 
        direction={isMobile ? 'column' : 'row'} 
        spacing={2} 
        alignItems={isMobile ? 'flex-start' : 'center'} 
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography 
          variant={isMobile ? 'h5' : 'h4'} 
          component="h1"
          sx={{ fontWeight: 600 }}
        >
          Gestión de Órdenes
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <ToggleButton
            value="auto-refresh"
            selected={autoRefresh}
            onChange={() => onAutoRefreshToggle(!autoRefresh)}
            size="small"
            sx={{ 
              minHeight: isMobile ? 44 : 36,
              minWidth: isMobile ? 44 : 36,
            }}
          >
            <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Auto
            </Typography>
          </ToggleButton>
          <IconButton
            onClick={onRefresh}
            disabled={isRefreshing}
            sx={{ 
              minHeight: isMobile ? 44 : 40,
              minWidth: isMobile ? 44 : 40,
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Buscar por teléfono, nombre o ID de pedido..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-root': {
            minHeight: isMobile ? 48 : 40,
          },
        }}
      />

      {/* Quick Filters */}
      <Stack 
        direction={isMobile ? 'column' : 'row'} 
        spacing={1} 
        sx={{ mb: 2 }}
      >
        <ToggleButtonGroup
          value={quickFilter}
          exclusive
          onChange={(_, value) => value && onQuickFilterChange(value)}
          size={isMobile ? 'medium' : 'small'}
          fullWidth={isMobile}
        >
          <ToggleButton value="all" sx={{ minHeight: isMobile ? 44 : 36 }}>
            <Badge badgeContent={Object.values(orderCounts).reduce((a, b) => a + b, 0)} color="primary">
              <Typography variant="button">Todos</Typography>
            </Badge>
          </ToggleButton>
          <ToggleButton value="pending" sx={{ minHeight: isMobile ? 44 : 36 }}>
            <Badge badgeContent={totalPending} color="warning">
              <Typography variant="button">Pendientes</Typography>
            </Badge>
          </ToggleButton>
          <ToggleButton value="unpaid" sx={{ minHeight: isMobile ? 44 : 36 }}>
            <Badge badgeContent={totalUnpaid} color="error">
              <Typography variant="button">Sin Pagar</Typography>
            </Badge>
          </ToggleButton>
          <ToggleButton value="urgent" sx={{ minHeight: isMobile ? 44 : 36 }}>
            <Badge badgeContent={totalUrgent} color="error">
              <Typography variant="button">Urgentes</Typography>
            </Badge>
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Status Count Badges */}
      <Stack 
        direction="row" 
        spacing={1} 
        flexWrap="wrap"
        sx={{ gap: 1 }}
      >
        {Object.values(OrderStatus).map((status) => (
          <Badge
            key={status}
            badgeContent={orderCounts[status]}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: getStatusColor(status),
                color: 'white',
                minWidth: 24,
                height: 24,
                fontSize: '0.75rem',
              },
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: `${getStatusColor(status)}20`,
                border: `1px solid ${getStatusColor(status)}`,
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: getStatusColor(status),
                  fontWeight: 600,
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                }}
              >
                {OrderStatusLabels[status]}
              </Typography>
            </Box>
          </Badge>
        ))}
      </Stack>
    </Box>
  );
};

