'use client';

import React from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Stack,
  Typography,
  Chip,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { OrderAlert } from '@/features/admin/hooks/useOrderAlerts';

interface OrderAlertsProps {
  alerts: OrderAlert[];
  onAlertClick?: (orderId: string) => void;
}

const getAlertIcon = (severity: OrderAlert['severity']) => {
  switch (severity) {
    case 'error':
      return <ErrorIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'info':
      return <InfoIcon />;
  }
};

export const OrderAlerts: React.FC<OrderAlertsProps> = ({
  alerts,
  onAlertClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (alerts.length === 0) {
    return null;
  }

  const alertsBySeverity = {
    error: alerts.filter(a => a.severity === 'error'),
    warning: alerts.filter(a => a.severity === 'warning'),
    info: alerts.filter(a => a.severity === 'info'),
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, borderColor: 'warning.main' }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <WarningIcon color="warning" />
          <Typography variant="h6">Alertas</Typography>
          <Chip
            label={alerts.length}
            color="error"
            size="small"
            sx={{ minHeight: isMobile ? 24 : 20 }}
          />
        </Stack>

        <Stack spacing={2}>
          {alertsBySeverity.error.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="error" gutterBottom>
                Urgentes ({alertsBySeverity.error.length})
              </Typography>
              <Stack spacing={1}>
                {alertsBySeverity.error.map((alert) => (
                  <Alert
                    key={alert.orderId}
                    severity="error"
                    icon={getAlertIcon(alert.severity)}
                    onClick={() => onAlertClick?.(alert.orderId)}
                    sx={{
                      cursor: onAlertClick ? 'pointer' : 'default',
                      minHeight: isMobile ? 56 : 48,
                      '&:hover': onAlertClick ? { opacity: 0.9 } : {},
                    }}
                  >
                    <AlertTitle>Pedido #{alert.orderId.slice(-6)}</AlertTitle>
                    {alert.message}
                  </Alert>
                ))}
              </Stack>
            </Box>
          )}

          {alertsBySeverity.warning.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="warning.main" gutterBottom>
                Advertencias ({alertsBySeverity.warning.length})
              </Typography>
              <Stack spacing={1}>
                {alertsBySeverity.warning.map((alert) => (
                  <Alert
                    key={alert.orderId}
                    severity="warning"
                    icon={getAlertIcon(alert.severity)}
                    onClick={() => onAlertClick?.(alert.orderId)}
                    sx={{
                      cursor: onAlertClick ? 'pointer' : 'default',
                      minHeight: isMobile ? 56 : 48,
                      '&:hover': onAlertClick ? { opacity: 0.9 } : {},
                    }}
                  >
                    <AlertTitle>Pedido #{alert.orderId.slice(-6)}</AlertTitle>
                    {alert.message}
                  </Alert>
                ))}
              </Stack>
            </Box>
          )}

          {alertsBySeverity.info.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="info.main" gutterBottom>
                Información ({alertsBySeverity.info.length})
              </Typography>
              <Stack spacing={1}>
                {alertsBySeverity.info.map((alert) => (
                  <Alert
                    key={alert.orderId}
                    severity="info"
                    icon={getAlertIcon(alert.severity)}
                    onClick={() => onAlertClick?.(alert.orderId)}
                    sx={{
                      cursor: onAlertClick ? 'pointer' : 'default',
                      minHeight: isMobile ? 56 : 48,
                      '&:hover': onAlertClick ? { opacity: 0.9 } : {},
                    }}
                  >
                    <AlertTitle>Pedido #{alert.orderId.slice(-6)}</AlertTitle>
                    {alert.message}
                  </Alert>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

