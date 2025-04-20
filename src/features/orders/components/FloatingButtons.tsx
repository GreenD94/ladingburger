'use client';

import React from 'react';
import { Box, Fab } from '@mui/material';
import { WhatsApp as WhatsAppIcon, Instagram as InstagramIcon, Payment as PaymentIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useOrders } from '../hooks/useOrders';
import { useSearchParams } from 'next/navigation';

interface FloatingButtonsProps {
  businessContact: {
    whatsappLink: string;
    instagramLink: string;
  };
  onPaymentClick: () => void;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  businessContact,
  onPaymentClick,
}) => {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber');
  const { orders } = useOrders(phoneNumber || '');
  const hasPendingOrders = orders.some(order => order.status !== 5); // 5 is COMPLETED status

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
      {hasPendingOrders && (
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.2, 1, 1.2, 1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
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
        </motion.div>
      )}
    </Box>
  );
}; 