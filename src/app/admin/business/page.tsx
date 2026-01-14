'use client';

import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { WhatsAppNumberInput } from '@/features/admin/components/business/WhatsAppNumberInput.component';

export default function BusinessPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Configuración del Negocio
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <WhatsAppNumberInput />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 