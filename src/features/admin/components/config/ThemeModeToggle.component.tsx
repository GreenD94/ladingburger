'use client';

import React from 'react';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import { AdminThemeMode } from '@/features/database/types/index.type';
import { useAdminTheme } from '@/features/admin/hooks/useAdminTheme.hook';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';

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

  const isDarkMode = themeMode === 'dark';

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('adminThemeMode')}
      </Typography>
      <FormControlLabel
        control={<Switch checked={isDarkMode} onChange={handleToggle} />}
        label={isDarkMode ? t('darkMode') : t('lightMode')}
      />
    </Box>
  );
}

