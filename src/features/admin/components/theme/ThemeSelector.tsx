'use client';

import React, { useState, useEffect } from 'react';
import { Box, Radio, RadioGroup, FormControlLabel, FormControl, Typography, Card, CardContent } from '@mui/material';
import { getSettings } from '@/features/database/actions/settings/getSettings';
import { updateSettings } from '@/features/database/actions/settings/updateSettings';
import { getAllMenuThemes } from '@/features/menu/themes/menuThemes';
import { MenuTheme } from '@/features/database/types/settings';
import { useLanguage } from '@/features/i18n/hooks/useLanguage';

interface ThemeSelectorProps {
  onThemeChange?: (themeName: string) => void;
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<MenuTheme>('green');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useLanguage();
  const availableThemes = getAllMenuThemes();

  useEffect(() => {
    const loadCurrentTheme = async () => {
      try {
        const settings = await getSettings();
        setSelectedTheme(settings.menuTheme);
        if (onThemeChange) {
          onThemeChange(settings.menuTheme);
        }
      } catch (error) {
        console.error('Error loading current theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentTheme();
  }, [onThemeChange]);

  const handleThemeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.value as MenuTheme;
    setSelectedTheme(newTheme);

    if (onThemeChange) {
      onThemeChange(newTheme);
    }

    try {
      await updateSettings({ menuTheme: newTheme });
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  if (isLoading) {
    return <Typography>{t('loading')}</Typography>;
  }

  return (
    <FormControl component="fieldset">
      <Typography variant="h6" gutterBottom>
        {t('selectTheme')}
      </Typography>
      <RadioGroup value={selectedTheme} onChange={handleThemeChange}>
        {Object.keys(availableThemes).map((themeName) => (
          <Card key={themeName} sx={{ mb: 2 }}>
            <CardContent>
              <FormControlLabel
                value={themeName}
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {themeName}
                    </Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </FormControl>
  );
}

