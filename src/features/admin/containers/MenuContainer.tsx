'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { TopBar } from '@/features/admin/components/TopBar';
import { MenuManager } from '@/features/admin/components/menu/MenuManager';

export const MenuContainer: React.FC = () => {
  const handleMenuClick = () => {
    // TODO: Implementar la lógica del menú
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f9fafb', // Equivalente a bg-gray-50
      }}
    >
      <TopBar onMenuClick={handleMenuClick} />
      <Box component="main" sx={{ flexGrow: 1, pt: 0 }}>
        <Container maxWidth="lg" sx={{ pt: 1, pb: 4 }}>
          <MenuManager />
        </Container>
      </Box>
    </Box>
  );
}; 