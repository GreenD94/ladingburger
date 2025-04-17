'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { MenuSection } from './MenuSection';
import { OrderSummary } from './OrderSummary';
import { PhoneDialog } from './PhoneDialog';
import { useOrderForm } from '../hooks/useOrderForm';

export const OrderForm: React.FC = () => {
  const {
    state,
    setState,
    handleAddBurger,
    handleRemoveIngredient,
    handleAddIngredient,
    handleAddNote,
    handleRemoveBurger,
    handleSubmitOrder
  } = useOrderForm();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
      <Typography
        variant="h2"
        sx={{
          textAlign: 'center',
          mb: 6,
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
        Crea Tu Pedido
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
        <MenuSection
          burgers={state.burgers}
          onAddBurger={handleAddBurger}
        />
        <OrderSummary
          selectedBurgers={state.selectedBurgers}
          onRemoveIngredient={handleRemoveIngredient}
          onAddIngredient={handleAddIngredient}
          onAddNote={handleAddNote}
          onRemoveBurger={handleRemoveBurger}
          onSubmitOrder={handleSubmitOrder}
          loading={state.loading}
        />
      </Box>

      <PhoneDialog
        open={state.showPhoneDialog}
        phoneNumber={state.phoneNumber}
        onClose={() => setState(prev => ({ ...prev, showPhoneDialog: false }))}
        onPhoneNumberChange={(value) => setState(prev => ({ ...prev, phoneNumber: value }))}
        onSubmit={handleSubmitOrder}
      />
    </Box>
  );
}; 