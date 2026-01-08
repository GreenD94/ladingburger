'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Skeleton, CircularProgress } from '@mui/material';
import { getAvailableBurgers } from '@/features/database/actions/menu/getAvailableBurgers';
import { Burger } from '@/features/database/types';
import { MenuItem } from './MenuItem';

export const MenuList: React.FC = () => {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        setLoading(true);
        const availableBurgers = await getAvailableBurgers();
        if (availableBurgers) {
          setBurgers(availableBurgers);
        } else {
          setError('No se pudieron cargar los productos');
        }
      } catch (err) {
        console.error('Error al cargar el menú:', err);
        setError('Error al cargar el menú');
      } finally {
        setLoading(false);
      }
    };

    fetchBurgers();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 8,
        }}
      >
        <CircularProgress sx={{ color: '#FF6B00', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#2C1810' }}>
          Cargando nuestro menú...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 8,
          px: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: '#d32f2f', textAlign: 'center' }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (burgers.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 8,
          px: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: '#2C1810', textAlign: 'center' }}>
          No hay productos disponibles en este momento
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {burgers.map((burger, index) => (
        <MenuItem key={burger._id?.toString() || index} burger={burger} index={index} />
      ))}
      <Box
        sx={{
          width: '100%',
          height: '72vh',
          boxSizing: 'border-box',
        }}
      />
    </>
  );
};

