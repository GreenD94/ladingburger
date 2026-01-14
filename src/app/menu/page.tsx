'use client';

import { Suspense } from 'react';
import { MenuContainer } from '@/features/menu/containers/Menu.container';

export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuContainer />
    </Suspense>
  );
}
