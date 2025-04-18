'use client';

import { Suspense } from 'react';
import { OrdersContainer } from '@/features/orders/container/Orders.container';

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersContainer />
    </Suspense>
  );
} 