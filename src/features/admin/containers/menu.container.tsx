'use client';

import React from 'react';
import { Box } from '@mui/material';
import { TopBar } from '@/features/admin/components/TopBar';
import { MenuManager } from '@/features/admin/components/menu/MenuManager';

export const MenuContainer: React.FC = () => {
  const handleMenuClick = () => {
    // TODO: Implementar la lógica del menú
  };

  return (
    <Box>
      <TopBar onMenuClick={handleMenuClick} />
      <Box sx={{ pt: 8 }}>
        <MenuManager />
      </Box>
    </Box>
  );
};
