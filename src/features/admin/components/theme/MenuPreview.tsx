'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getSettings } from '@/features/database/actions/settings/getSettings';
import { useLanguage } from '@/features/i18n/hooks/useLanguage';

interface MenuPreviewProps {
  selectedThemeName?: string;
}

const IPHONE_12_PRO_WIDTH = 390;
const IPHONE_12_PRO_HEIGHT = 844;
const PHONE_SCALE = 0.8;

export function MenuPreview({ selectedThemeName }: MenuPreviewProps) {
  const [previewTheme, setPreviewTheme] = useState<string>('green');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (selectedThemeName) {
      setPreviewTheme(selectedThemeName);
      setIsLoading(false);
      return;
    }

    const loadTheme = async () => {
      try {
        const settings = await getSettings();
        setPreviewTheme(settings.menuTheme);
      } catch (error) {
        console.error('Error loading theme for preview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [selectedThemeName]);

  if (isLoading) {
    return <Typography>{t('loading')}</Typography>;
  }

  const previewUrl = `/menu?theme=${previewTheme}`;
  const scaledWidth = IPHONE_12_PRO_WIDTH * PHONE_SCALE;
  const scaledHeight = IPHONE_12_PRO_HEIGHT * PHONE_SCALE;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
        {t('preview')} - iPhone 12 Pro
      </Typography>
      <Box
        sx={{
          width: scaledWidth,
          height: scaledHeight,
          position: 'relative',
          borderRadius: '40px',
          padding: '12px',
          background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 0 2px rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '24px',
            borderRadius: '0 0 20px 20px',
            background: '#000',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '28px',
            overflow: 'hidden',
            background: '#000',
            position: 'relative',
            paddingBottom: '34px',
          }}
        >
          <Box
            component="iframe"
            src={previewUrl}
            sx={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '134px',
              height: '5px',
              borderRadius: '3px',
              background: 'rgba(255, 255, 255, 0.3)',
              zIndex: 2,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

