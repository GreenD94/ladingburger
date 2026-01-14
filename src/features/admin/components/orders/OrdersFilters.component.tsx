'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { OrderStatus, OrderStatusType, PaymentStatus, PaymentStatusType, OrderStatusLabels, PaymentStatusLabels } from '@/features/database/types/index.type';
import { EMPTY_DATE_RANGE, EMPTY_AMOUNT_RANGE, EMPTY_ORDERS_FILTERS_STATE } from '@/features/database/constants/emptyValues.constants';

export interface OrdersFiltersState {
  dateRange: {
    start: Date;
    end: Date;
  };
  statuses: OrderStatusType[];
  paymentStatuses: PaymentStatusType[];
  amountRange: {
    min: number;
    max: number;
  };
}

interface OrdersFiltersProps {
  filters: OrdersFiltersState;
  onFiltersChange: (filters: OrdersFiltersState) => void;
  onClear: () => void;
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear,
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const hasStartDate = filters.dateRange.start.getTime() !== 0;
  const hasEndDate = filters.dateRange.end.getTime() !== 0;
  const hasMinAmount = filters.amountRange.min !== 0;
  const hasMaxAmount = filters.amountRange.max !== 0;

  const activeFilterCount = 
    (hasStartDate || hasEndDate ? 1 : 0) +
    filters.statuses.length +
    filters.paymentStatuses.length +
    (hasMinAmount ? 1 : 0) +
    (hasMaxAmount ? 1 : 0);

  const handleStatusChange = (status: OrderStatusType) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handlePaymentStatusChange = (status: PaymentStatusType) => {
    const newStatuses = filters.paymentStatuses.includes(status)
      ? filters.paymentStatuses.filter(s => s !== status)
      : [...filters.paymentStatuses, status];
    onFiltersChange({ ...filters, paymentStatuses: newStatuses });
  };

  const handleClear = () => {
    onClear();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={() => setOpen(true)}
        sx={{
          minHeight: isMobile ? 44 : 36,
        }}
      >
        Filtros
        {activeFilterCount > 0 && (
          <Chip
            label={activeFilterCount}
            size="small"
            color="primary"
            sx={{ ml: 1, height: 20, minWidth: 20 }}
          />
        )}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Filtros Avanzados</Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <ClearIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Rango de Fechas
              </Typography>
              <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                <TextField
                  label="Fecha Inicio"
                  type="date"
                  value={hasStartDate ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : new Date(0);
                    onFiltersChange({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: date },
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth={isMobile}
                  sx={{ minHeight: isMobile ? 56 : 40 }}
                />
                <TextField
                  label="Fecha Fin"
                  type="date"
                  value={hasEndDate ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : new Date(0);
                    onFiltersChange({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: date },
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth={isMobile}
                  sx={{ minHeight: isMobile ? 56 : 40 }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Estado del Pedido
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {Object.values(OrderStatus).map((status) => (
                  <Chip
                    key={status}
                    label={OrderStatusLabels[status]}
                    onClick={() => handleStatusChange(status)}
                    color={filters.statuses.includes(status) ? 'primary' : 'default'}
                    variant={filters.statuses.includes(status) ? 'filled' : 'outlined'}
                    sx={{ minHeight: isMobile ? 40 : 32 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Estado de Pago
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {Object.values(PaymentStatus).map((status) => (
                  <Chip
                    key={status}
                    label={PaymentStatusLabels[status]}
                    onClick={() => handlePaymentStatusChange(status)}
                    color={filters.paymentStatuses.includes(status) ? 'primary' : 'default'}
                    variant={filters.paymentStatuses.includes(status) ? 'filled' : 'outlined'}
                    sx={{ minHeight: isMobile ? 40 : 32 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Rango de Monto
              </Typography>
              <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                <TextField
                  label="Monto Mínimo"
                  type="number"
                  value={hasMinAmount ? filters.amountRange.min : ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    onFiltersChange({
                      ...filters,
                      amountRange: { ...filters.amountRange, min: value },
                    });
                  }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                  fullWidth={isMobile}
                  sx={{ minHeight: isMobile ? 56 : 40 }}
                />
                <TextField
                  label="Monto Máximo"
                  type="number"
                  value={hasMaxAmount ? filters.amountRange.max : ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : 0;
                    onFiltersChange({
                      ...filters,
                      amountRange: { ...filters.amountRange, max: value },
                    });
                  }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                  fullWidth={isMobile}
                  sx={{ minHeight: isMobile ? 56 : 40 }}
                />
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleClear}
            color="error"
            variant="outlined"
            sx={{ minHeight: isMobile ? 44 : 36 }}
          >
            Limpiar Todo
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            sx={{ minHeight: isMobile ? 44 : 36 }}
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

