'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import { TopBar } from '@/features/landing/components/TopBar';
import { OrdersList } from '../components/OrdersList';
import { PaymentInfoDialog } from '../components/PaymentInfoDialog';
import { FloatingButtons } from '../components/FloatingButtons';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useBusinessContact } from '../hooks/useBusinessContact';
import { useOrders } from '../hooks/useOrders';
import { PhoneInput } from '../components/PhoneInput';

export const OrdersContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const { businessContact, isLoading: businessContactLoading } = useBusinessContact();
  const { orders, loading } = useOrders(phoneNumber);

  const handlePhoneSubmit = (phone: string) => {
    router.push(`/orders?phoneNumber=${phone}`);
  };

  if (loading || businessContactLoading) {
    return <LoadingState />;
  }

  if (!phoneNumber) {
    return (
      <Box>
        <TopBar />
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: '80vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pt: 8,
            }}
          >
            <PhoneInput onSubmit={handlePhoneSubmit} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (!businessContact) {
    return <ErrorState message="Business contact information not available" />;
  }

  return (
    <Box>
      <TopBar />
      <Container>
        <Box py={4} sx={{ pt: 8 }} mt={10}>
          <OrdersList 
            orders={orders} 
            isLoading={loading}
          />
          <FloatingButtons 
            businessContact={businessContact} 
            onPaymentClick={() => setShowPaymentInfo(true)} 
          />
          <PaymentInfoDialog 
            open={showPaymentInfo} 
            onClose={() => setShowPaymentInfo(false)} 
            businessContact={businessContact} 
          />
        </Box>
      </Container>
    </Box>
  );
}; 