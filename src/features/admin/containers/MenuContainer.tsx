'use client';

import React from 'react';
import { TopBar } from '@/features/admin/components/TopBar';
import { MenuManager } from '@/features/admin/components/menu/MenuManager';

export const MenuContainer: React.FC = () => {
  const handleMenuClick = () => {
    // TODO: Implementar la lógica del menú
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar onMenuClick={handleMenuClick} />
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MenuManager />
        </div>
      </main>
    </div>
  );
}; 