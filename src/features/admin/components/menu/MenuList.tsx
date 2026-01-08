'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Burger } from '@/features/database/types';
import { BurgerRow } from './BurgerRow';
import LoadingState from '@/features/analytics/components/LoadingState';
import ErrorState from '@/features/analytics/components/ErrorState';

interface MenuListProps {
  burgers: Burger[];
  loading: boolean;
  error: string | null;
  onEdit: (burger: Burger) => void;
  onDelete: (burger: Burger) => void;
}

export const MenuList: React.FC<MenuListProps> = ({
  burgers,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <LoadingState title="Cargando menú..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  if (burgers.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay hamburguesas en el menú. Crea una nueva para comenzar.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {burgers.map((burger) => (
        <BurgerRow
          key={burger._id?.toString()}
          burger={burger}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
};

