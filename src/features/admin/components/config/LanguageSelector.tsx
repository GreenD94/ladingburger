'use client';

import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, SelectChangeEvent } from '@mui/material';
import { Language } from '@/features/database/types/settings';
import { useLanguage } from '@/features/i18n/hooks/useLanguage';

export function LanguageSelector() {
  const { language, setLanguage, t, isLoading } = useLanguage();

  const handleLanguageChange = async (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value as Language;
    await setLanguage(newLanguage);
  };

  if (isLoading) {
    return <Typography>{t('loading')}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('language')}
      </Typography>
      <FormControl fullWidth>
        <InputLabel>{t('language')}</InputLabel>
        <Select value={language} onChange={handleLanguageChange} label={t('language')}>
          <MenuItem value="en">{t('english')}</MenuItem>
          <MenuItem value="es">{t('spanish')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

