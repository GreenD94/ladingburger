'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../contexts/CartContext.context';
import { DrawerOverlay } from './DrawerOverlay.component';
import { DrawerContent } from './DrawerContent.component';
import { MenuAnimations } from '../styles/menuAnimations.styles';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock.hook';
import { Z_INDEX_CART_BUTTON } from '../constants/zIndex.constants';

export const CartDrawer: React.FC = () => {
  const { isOpen, closeCart, openCart } = useCart();
  useBodyScrollLock(isOpen);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const DRAG_HANDLE_WIDTH = 50;

  const handleStart = (clientX: number, target: EventTarget | null) => {
    if (isOpen) return; // Only handle drag when closed
    
    const isButton = target instanceof HTMLButtonElement || 
                     (target instanceof HTMLElement && target.closest('button') !== null);
    
    if (isButton) {
      return; // Don't start drag if clicking on a button
    }
    
    const windowWidth = window.innerWidth;
    const startFromRightEdge = windowWidth - clientX <= DRAG_HANDLE_WIDTH;
    
    if (startFromRightEdge) {
      setIsDragging(true);
      startXRef.current = clientX;
      currentXRef.current = clientX;
      setDragOffset(0);
    }
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || isOpen) return;
    const deltaX = clientX - startXRef.current;
    // Only allow dragging to the left (negative deltaX) to open
    if (deltaX < 0) {
      currentXRef.current = clientX;
      setDragOffset(deltaX);
    }
  };

  const handleEnd = () => {
    if (!isDragging || isOpen) return;
    const deltaX = currentXRef.current - startXRef.current;
    const threshold = 100; // pixels
    
    // If dragged left enough, open the drawer
    if (Math.abs(deltaX) > threshold) {
      openCart();
    }
    
    setIsDragging(false);
    setDragOffset(0);
    startXRef.current = 0;
    currentXRef.current = 0;
  };

  // Mouse events
  const handleMouseDown = (e: MouseEvent) => {
    if (isOpen) return;
    const target = e.target as HTMLElement;
    const isButton = target instanceof HTMLButtonElement || target.closest('button') !== null;
    
    if (isButton) {
      return; // Don't start drag if clicking on a button
    }
    
    handleStart(e.clientX, e.target);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: TouchEvent) => {
    if (isOpen) return;
    if (e.touches.length === 0) return;
    
    const target = e.target as HTMLElement;
    const isButton = target instanceof HTMLButtonElement || target.closest('button') !== null;
    
    if (isButton) {
      return; // Don't start drag if touching on a button
    }
    
    handleStart(e.touches[0].clientX, e.target);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    if (!isOpen) {
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('touchstart', handleTouchStart);
      
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, isOpen]);

  return (
    <>
      <MenuAnimations />
      <DrawerOverlay isOpen={isOpen} onClose={closeCart} />
      <DrawerContent isOpen={isOpen} externalDragOffset={!isOpen && isDragging ? dragOffset : 0} />
    </>
  );
};

