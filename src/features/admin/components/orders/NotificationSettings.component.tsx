'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Stack,
  TextField,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface NotificationSettings {
  soundEnabled: boolean;
  paymentWaitingMinutes: number;
  cookingDelayMinutes: number;
  issueUrgentMinutes: number;
}

const DEFAULT_SOUND_ENABLED = true;
const DEFAULT_PAYMENT_WAITING_MINUTES = 10;
const DEFAULT_COOKING_DELAY_MINUTES = 30;
const DEFAULT_ISSUE_URGENT_MINUTES = 30;
const STORAGE_KEY = 'orderNotificationSettings';

const defaultSettings: NotificationSettings = {
  soundEnabled: DEFAULT_SOUND_ENABLED,
  paymentWaitingMinutes: DEFAULT_PAYMENT_WAITING_MINUTES,
  cookingDelayMinutes: DEFAULT_COOKING_DELAY_MINUTES,
  issueUrgentMinutes: DEFAULT_ISSUE_URGENT_MINUTES,
};

export const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field: keyof NotificationSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <NotificationsIcon color="primary" />
          <Typography variant="h6">Configuración de Notificaciones</Typography>
        </Stack>

        <Stack spacing={3}>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.soundEnabled}
                  onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                />
              }
              label="Activar sonido de notificaciones"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Reproducir sonido cuando haya nuevas alertas
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Umbrales de Alerta
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Configura cuánto tiempo debe pasar antes de generar una alerta
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Minutos para alerta de pago pendiente"
                type="number"
                value={settings.paymentWaitingMinutes}
                onChange={(e) => handleChange('paymentWaitingMinutes', parseInt(e.target.value) || 0)}
                inputProps={{ min: 1 }}
                fullWidth
                size={isMobile ? 'medium' : 'small'}
                sx={{ minHeight: isMobile ? 56 : 40 }}
              />

              <TextField
                label="Minutos para alerta de cocina retrasada"
                type="number"
                value={settings.cookingDelayMinutes}
                onChange={(e) => handleChange('cookingDelayMinutes', parseInt(e.target.value) || 0)}
                inputProps={{ min: 1 }}
                fullWidth
                size={isMobile ? 'medium' : 'small'}
                sx={{ minHeight: isMobile ? 56 : 40 }}
              />

              <TextField
                label="Minutos para alerta de problema urgente"
                type="number"
                value={settings.issueUrgentMinutes}
                onChange={(e) => handleChange('issueUrgentMinutes', parseInt(e.target.value) || 0)}
                inputProps={{ min: 1 }}
                fullWidth
                size={isMobile ? 'medium' : 'small'}
                sx={{ minHeight: isMobile ? 56 : 40 }}
              />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              fullWidth={isMobile}
              sx={{ minHeight: isMobile ? 44 : 36 }}
            >
              {saved ? 'Guardado!' : 'Guardar Configuración'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

