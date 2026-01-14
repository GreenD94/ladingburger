'use client';

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { ThemeSelector } from '@/features/admin/components/theme/ThemeSelector.component';
import { MenuPreview } from '@/features/admin/components/theme/MenuPreview.component';
import { getSettings } from '@/features/database/actions/settings/getSettings.action';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';

export default function ThemePage() {
  const [selectedThemeName, setSelectedThemeName] = useState<string>('green');
  const { t } = useLanguage();

  useEffect(() => {
    const loadCurrentTheme = async () => {
      try {
        const settings = await getSettings();
        setSelectedThemeName(settings.menuTheme);
      } catch (error) {
        console.error('Error loading current theme:', error);
      }
    };

    loadCurrentTheme();
  }, []);

  const handleThemeChange = (themeName: string) => {
    setSelectedThemeName(themeName);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('theme')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <ThemeSelector onThemeChange={handleThemeChange} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <MenuPreview selectedThemeName={selectedThemeName} />
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ height: '400px' }} />
    </Box>
  );
}

