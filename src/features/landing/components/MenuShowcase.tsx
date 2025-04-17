'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Chip, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { getAvailableBurgers } from '@/features/database/actions/menu';
import { Burger } from '@/features/database/types';
import { useRouter } from 'next/navigation';

export const MenuShowcase = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current || burgers.length === 0) return;

    const scrollContainer = scrollContainerRef.current;
    const cardWidth = 280; // Width of each card + gap
    const scrollInterval = 3000; // 3 seconds between scrolls

    const autoScroll = setInterval(() => {
      const nextIndex = (currentIndex + 1) % burgers.length;
      setCurrentIndex(nextIndex);
      
      scrollContainer.scrollTo({
        left: nextIndex * cardWidth,
        behavior: 'smooth'
      });
    }, scrollInterval);

    return () => clearInterval(autoScroll);
  }, [isMobile, currentIndex, burgers.length]);

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

      <Box 
        ref={scrollContainerRef}
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          overflowX: isMobile ? 'auto' : 'visible',
          overflowY: 'hidden', // Prevent vertical scrolling
          pb: isMobile ? 2 : 0,
          scrollBehavior: 'smooth',
          height: 'fit-content', // Ensure container height fits content
          '&::-webkit-scrollbar': {
            height: '8px',
            display: 'none', // Hide scrollbar on mobile
          },
          '&::-webkit-scrollbar-track': {
            background: '#FFF8F0',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#FF6B00',
            borderRadius: '4px',
            '&:hover': {
              background: '#E55C00',
            },
          },
        }}
      >
        <Box sx={{ 
          display: isMobile ? 'flex' : 'grid',
          gridTemplateColumns: isMobile ? 'none' : {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 4,
          maxWidth: '1200px',
          width: '100%',
          ...(isMobile ? {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            paddingRight: '16px',
            height: 'fit-content', // Ensure inner container height fits content
          } : {})
        }}>
          {burgers.map((burger, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                ...(isMobile ? {
                  minWidth: '280px',
                  flexShrink: 0,
                } : {})
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