'use client';

import React from 'react';
import { useCart } from '../contexts/CartContext.context';
import { DrawerOverlay } from './DrawerOverlay.component';
import { DrawerContent } from './DrawerContent.component';
import { MenuAnimations } from '../styles/menuAnimations.styles';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock.hook';
import { useDrawerOpenDrag } from '../hooks/useDrawerOpenDrag.hook';

export const CartDrawer: React.FC = () => {
  const { isOpen, closeCart, openCart } = useCart();
  useBodyScrollLock(isOpen);
  
  const { dragOffset, isDragging } = useDrawerOpenDrag({
    isOpen,
    onOpen: openCart,
  });

  const externalDragOffset = !isOpen && isDragging ? dragOffset : 0;

  return (
    <>
      <MenuAnimations />
      <DrawerOverlay isOpen={isOpen} onClose={closeCart} />
      <DrawerContent isOpen={isOpen} externalDragOffset={externalDragOffset} />
    </>
  );
};
