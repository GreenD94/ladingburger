'use client';

import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { MenuSection } from './MenuSection.component';
import { OrderSummary } from './OrderSummary.component';
import { PhoneDialog } from './PhoneDialog.component';
import { useOrderForm } from '../hooks/useOrderForm.hook';

export const OrderForm: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    state,
    setState,
    handleAddBurger,
    handleRemoveBurger,
    handleRemoveIngredient,
    handleAddIngredient,
    handleAddNote,
    handleSubmitOrder,
  } = useOrderForm();

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          color: '#2C1810',
          textAlign: 'center',
          mb: 4,
          fontWeight: 'bold',
        }}
      >
        Crea tu Pedido
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '60%' },
            maxWidth: { xs: '100%', md: '800px' },
          }}
        >
          <MenuSection 
            burgers={state.burgers} 
            onAddBurger={handleAddBurger}
            isMobile={isMobile}
          />
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            maxWidth: { xs: '100%', md: '400px' },
            position: { xs: 'relative', md: 'sticky' },
            top: { md: 0 },
          }}
        >
          <OrderSummary
            selectedBurgers={state.selectedBurgers}
            onRemoveIngredient={handleRemoveIngredient}
            onAddIngredient={handleAddIngredient}
            onRemoveBurger={handleRemoveBurger}
            onAddNote={handleAddNote}
            onSubmitOrder={handleSubmitOrder}
            loading={state.loading}
          />
        </Box>
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

