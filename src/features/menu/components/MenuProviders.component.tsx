'use client';

import React, { ReactNode } from 'react';
import { MenuThemeProvider } from '../contexts/MenuThemeContext.context';
import { CartProvider } from '../contexts/CartContext.context';
import { VisibleMenuItemProvider } from '../contexts/VisibleMenuItemContext.context';
import { SafeArea } from './SafeArea.component';
import { MenuList } from './MenuList.component';
import { CartDrawer } from './CartDrawer.component';

interface MenuProvidersProps {
  previewThemeName?: string;
}

export const MenuProviders: React.FC<MenuProvidersProps> = ({ previewThemeName }) => {
  const safeAreaStyle = { paddingTop: '5px', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '5px' };

  return (
    <MenuThemeProvider previewThemeName={previewThemeName}>
      <CartProvider>
        <VisibleMenuItemProvider>
          <SafeArea style={safeAreaStyle}>
            <MenuList />
          </SafeArea>
          <CartDrawer />
        </VisibleMenuItemProvider>
      </CartProvider>
    </MenuThemeProvider>
  );
};

