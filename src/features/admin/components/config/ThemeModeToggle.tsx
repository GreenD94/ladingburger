'use client';

import React from 'react';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import { AdminThemeMode } from '@/features/database/types/settings';
import { useAdminTheme } from '@/features/admin/hooks/useAdminTheme';
import { useLanguage } from '@/features/i18n/hooks/useLanguage';

export function ThemeModeToggle() {
  const { themeMode, setThemeMode, isLoading } = useAdminTheme();
  const { t } = useLanguage();

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode: AdminThemeMode = event.target.checked ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  if (isLoading) {
    return <Typography>{t('loading')}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('adminThemeMode')}
      </Typography>
      <FormControlLabel
        control={<Switch checked={themeMode === 'dark'} onChange={handleToggle} />}
        label={themeMode === 'dark' ? t('darkMode') : t('lightMode')}
      />
    </Box>
  );
}

