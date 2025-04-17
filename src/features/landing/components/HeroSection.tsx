'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { VIDEO_PATHS } from '@/features/database/types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const HeroSection = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '80vh', md: '100vh' },
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={VIDEO_PATHS.HERO_BACKGROUND} type="video/mp4" />
      </video>

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7))',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          px: { xs: 2, md: 4 },
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 800,
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              color: '#FFFFFF',
              letterSpacing: '0.5px',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '4px',
                bgcolor: '#FF6B00',
                borderRadius: '2px',
              },
            }}
          >
            Las Hamburguesas Más Jugosas de Barquisimeto
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              maxWidth: '600px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              color: '#FFFFFF',
            }}
          >
            El sabor que conquistó el corazón de los larenses
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/create-order')}
            sx={{
              bgcolor: '#FF6B00',
              '&:hover': {
                bgcolor: '#E55C00',
                transform: 'translateY(-2px)',
              },
              px: 4,
              py: 1.5,
              fontSize: '1.2rem',
              borderRadius: '50px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            Ordenar Ahora
          </Button>
        </motion.div>

        {/* Promo Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            position: 'absolute',
            bottom: '5%',
            right: '5%',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '1rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#FF6B00',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            ¡Envío Gratis!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#2C1810',
              textAlign: 'center',
            }}
          >
            En compras mayores a $20
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
}; 