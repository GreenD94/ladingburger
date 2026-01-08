'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Burger } from '@/features/database/types';

interface MenuItemProps {
  burger: Burger;
  index: number;
}

const BACKGROUND_COLORS = [
  '#a98de6',
  '#47c2eb',
  '#a5dc67',
  '#ed5063',
  '#ed5063',
];

export const MenuItem: React.FC<MenuItemProps> = ({ burger, index }) => {
  const backgroundColor = BACKGROUND_COLORS[index % BACKGROUND_COLORS.length];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        bgcolor: backgroundColor,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        px: { xs: 3, md: 4 },
        pt: { xs: 4, md: 6 },
        pb: { xs: 4, md: 6 },
        borderRadius: '10px',
        py: '5px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: '100%',
            mt: 0,
            mb: { xs: 1.5, md: 2 },
          }}
        >
          {burger.name
            .split(' ')
            .map(word => word.toLowerCase() === 'hamburguesa' ? 'burger' : word)
            .map((word, wordIndex) => (
              <Typography
                key={wordIndex}
                variant="h1"
                component="div"
                sx={{
                  fontSize: { xs: '3.5rem', md: '5rem' },
                  fontWeight: 400,
                  fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
                  color: 'white',
                  textAlign: 'center',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  display: 'block',
                  mb: 0,
                  mt: 0,
                }}
              >
                {word}
              </Typography>
            ))}
        </Box>

        <Typography
          variant="h1"
          component="div"
          sx={{
            fontSize: { xs: '4.5rem', md: '7rem' },
            fontWeight: 400,
            fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
            color: 'white',
            textAlign: 'center',
            mb: '2px',
            mt: { xs: 0.5, md: 1 },
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
            letterSpacing: '0.02em',
            lineHeight: 1,
            width: '100%',
          }}
        >
          ${burger.price.toFixed(2)}
        </Typography>
      </Box>

      <Box
        sx={{
          mt: '2px',
          mb: '2px',
          alignSelf: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: '1 1 0',
          minHeight: 0,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={burger.image}
          alt={burger.name}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            display: 'block',
            objectFit: 'contain',
          }}
        />
      </Box>

      <Typography
        variant="h5"
        component="div"
        sx={{
          fontSize: { xs: '1.125rem', md: '1.5rem' },
          fontWeight: 400,
          fontFamily: '"Times New Roman", Times, serif',
          color: 'white',
          textAlign: 'left',
          maxWidth: { xs: '100%', md: '800px' },
          textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
          lineHeight: 1.6,
          width: '100%',
          flexShrink: 0,
          mt: 'auto',
          mb: 0,
        }}
      >
        {burger.description}
      </Typography>
  
    </Box>
  );
};

