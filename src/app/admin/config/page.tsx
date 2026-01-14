'use client';

import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { ThemeModeToggle } from '@/features/admin/components/config/ThemeModeToggle.component';
import { LanguageSelector } from '@/features/admin/components/config/LanguageSelector.component';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';

export default function ConfigPage() {
  const { t } = useLanguage();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('config')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <ThemeModeToggle />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <LanguageSelector />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

