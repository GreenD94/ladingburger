'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box,  Container } from '@mui/material';
import { OrdersList } from '../components/OrdersList';
import { PaymentInfoDialog } from '../components/PaymentInfoDialog';
import { FloatingButtons } from '../components/FloatingButtons';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useBusinessContact } from '../hooks/useBusinessContact';
import { useOrders } from '../hooks/useOrders';

export const OrdersContainer = () => {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const { businessContact, isLoading: businessContactLoading } = useBusinessContact();
  const { orders, loading, error } = useOrders(phoneNumber);

  if (loading || businessContactLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!businessContact) {
    return <ErrorState message="Business contact information not available" />;
  }

  return (
    <Container>
      <Box py={4}>
       
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
  );
}; 