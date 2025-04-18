'use client';

import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';

export function OrderConfirmation() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(145deg, rgba(20,20,20,1) 0%, rgba(30,30,30,1) 100%)'
          : 'linear-gradient(145deg, rgba(240,240,240,1) 0%, rgba(250,250,250,1) 100%)',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(30,30,30,1) 0%, rgba(40,40,40,1) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          ¡Orden Confirmada!
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Tu orden ha sido recibida exitosamente. Pronto recibirás un mensaje con los detalles de pago.
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          Por favor, realiza el pago según las instrucciones que recibirás y mantén el número de referencia para cualquier consulta.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push('/')}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: theme.shadows[4],
            '&:hover': {
              boxShadow: theme.shadows[6],
            },
          }}
        >
          Volver al Inicio
        </Button>
      </Paper>
    </Box>
  );
} 