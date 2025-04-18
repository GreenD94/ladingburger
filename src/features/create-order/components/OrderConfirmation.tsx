'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const OrderConfirmation: React.FC = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        textAlign: 'center',
        bgcolor: '#FFF8F0',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h2"
          sx={{
            mb: 4,
            fontWeight: 800,
            color: '#2C1810',
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
              bgcolor: '#FF6B00',
              borderRadius: '2px',
            },
          }}
        >
          ¡Pedido Recibido!
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 4,
            color: '#2C1810',
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Gracias por tu pedido. Un miembro de nuestro equipo se comunicará contigo pronto para procesar el pago.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 6,
            color: 'text.secondary',
            maxWidth: '500px',
            mx: 'auto',
          }}
        >
          Mientras tanto, puedes revisar el estado de tu pedido en cualquier momento.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/orders')}
          sx={{
            bgcolor: '#FF6B00',
            '&:hover': { bgcolor: '#E55C00' },
            px: 6,
            py: 2,
            fontSize: '1.1rem',
          }}
        >
          Ver Estado del Pedido
        </Button>
      </motion.div>
    </Box>
  );
}; 