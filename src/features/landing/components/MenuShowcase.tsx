'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { getAvailableBurgers } from '@/features/database/actions/menu';
import { Burger } from '@/features/database/types';
import { useRouter } from 'next/navigation';

export const MenuShowcase = () => {
  const router = useRouter();
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const availableBurgers = await getAvailableBurgers();
        if (availableBurgers) {
          console.log(availableBurgers);
          setBurgers(availableBurgers);
        }
      } catch (error) {
        console.error('Error al cargar el menú:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBurgers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, textAlign: 'center' }}>
        <Typography variant="h6">Cargando nuestro menú...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: 8, 
      px: { xs: 2, md: 4 },
      maxWidth: '1200px',
      mx: 'auto',
      bgcolor: '#FFF8F0', // Warm, appetizing background
    }}>
      <Typography
        variant="h2"
        sx={{
          textAlign: 'center',
          mb: 6,
          fontWeight: 800,
          color: '#2C1810', // Rich brown for text
          fontSize: { xs: '2rem', md: '3rem' },
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '4px',
            bgcolor: '#FF6B00', // Vibrant orange accent
            borderRadius: '2px',
          },
        }}
      >
        Las Hamburguesas Favoritas de Barquisimeto
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 4,
          maxWidth: '1200px',
          width: '100%',
        }}>
          {burgers.map((burger, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                style={{ width: '100%', maxWidth: '360px' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease-in-out',
                    bgcolor: 'white',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={burger.image}
                      alt={burger.name}
                      sx={{
                        objectFit: 'cover',
                      }}
                    />
                    <Chip
                      label={burger.category}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 600,
                        color: '#2C1810',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#2C1810',
                        mb: 1,
                      }}
                    >
                      {burger.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {burger.description}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#FF6B00',
                          fontWeight: 700,
                        }}
                      >
                        ${burger.price}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => router.push('/create-order')}
                        sx={{
                          bgcolor: '#FF6B00',
                          '&:hover': {
                            bgcolor: '#E55C00',
                            transform: 'translateY(-2px)',
                          },
                          borderRadius: '50px',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                      >
                        Ordenar Ahora
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}; 