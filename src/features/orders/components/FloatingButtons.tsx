'use client';

import React from 'react';
import { Box, Fab } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import PaymentIcon from '@mui/icons-material/Payment';
import { BusinessContact } from '@/features/database/types';

interface FloatingButtonsProps {
  businessContact: BusinessContact;
  onPaymentClick: () => void;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  businessContact,
  onPaymentClick,
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        zIndex: 1000,
      }}
    >
      <Fab
        color="primary"
        aria-label="whatsapp"
        href={businessContact.whatsappLink}
        target="_blank"
        sx={{
          bgcolor: '#25D366',
          '&:hover': {
            bgcolor: '#128C7E',
          },
          boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
        }}
      >
        <WhatsAppIcon />
      </Fab>
      <Fab
        color="primary"
        aria-label="instagram"
        href={businessContact.instagramLink}
        target="_blank"
        sx={{
          bgcolor: '#E1306C',
          '&:hover': {
            bgcolor: '#C13584',
          },
          boxShadow: '0 4px 12px rgba(225,48,108,0.3)',
        }}
      >
        <InstagramIcon />
      </Fab>
      <Fab
        color="primary"
        aria-label="payment info"
        onClick={onPaymentClick}
        sx={{
          bgcolor: '#FF6B00',
          '&:hover': {
            bgcolor: '#E55C00',
          },
          boxShadow: '0 4px 12px rgba(255,107,0,0.3)',
        }}
      >
        <PaymentIcon />
      </Fab>
    </Box>
  );
}; 