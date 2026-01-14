'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../contexts/CartContext.context';
import { CartHeader } from './CartHeader.component';
import { CheckeredDivider } from './CheckeredDivider.component';
import { CartItemCard } from './CartItemCard.component';
import { CartFooter } from './CartFooter.component';
import { ANIMATION_DURATION_MEDIUM } from '../constants/animations.constants';
import { Z_INDEX_LOADING_SCREEN } from '../constants/zIndex.constants';
import { CART_DRAWER_SHADOW } from '../constants/colors.constants';
import { PRIMARY_GREEN } from '../constants/cartColors.constants';

interface DrawerContentProps {
  isOpen: boolean;
  externalDragOffset?: number;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ isOpen, externalDragOffset = 0 }) => {
  const { items, closeCart, openCart, removeItem, updateQuantity, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();
  const hasItems = items.length > 0;
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const EDGE_THRESHOLD = 50; // pixels from right edge to start drag

  const handleBuyNow = () => {
    // TODO: Implement buy now action
  };

  const handleWhatsApp = () => {
    // TODO: Implement WhatsApp action
  };

  const handleAddNote = (burgerId: string) => {
    // TODO: Implement add note action
  };

  const handleStart = (clientX: number) => {
    const windowWidth = window.innerWidth;
    const startFromRightEdge = windowWidth - clientX <= EDGE_THRESHOLD;
    
    // Allow drag if drawer is open OR if starting from right edge when closed
    if (isOpen || (!isOpen && startFromRightEdge)) {
      setIsDragging(true);
      startXRef.current = clientX;
      currentXRef.current = clientX;
      setDragOffset(0);
    }
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startXRef.current;
    
    if (isOpen) {
      // When open, only allow dragging to the right (positive deltaX) to close
      if (deltaX > 0) {
        currentXRef.current = clientX;
        setDragOffset(deltaX);
      }
    } else {
      // When closed, only allow dragging to the left (negative deltaX) to open
      if (deltaX < 0) {
        currentXRef.current = clientX;
        // Calculate how much of the drawer should be visible
        const drawerWidth = drawerRef.current?.offsetWidth || window.innerWidth * 0.9;
        const maxOffset = drawerWidth;
        const offset = Math.min(Math.abs(deltaX), maxOffset);
        setDragOffset(-offset);
      }
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    const deltaX = currentXRef.current - startXRef.current;
    const drawerWidth = drawerRef.current?.offsetWidth || window.innerWidth * 0.9;
    const threshold = drawerWidth * 0.3;
    
    if (isOpen) {
      // If open and dragged right enough, close it
      if (deltaX > threshold) {
        closeCart();
      }
    } else {
      // If closed and dragged left enough, open it
      if (Math.abs(deltaX) > threshold) {
        openCart();
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    startXRef.current = 0;
    currentXRef.current = 0;
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
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
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  // Calculate transform based on state
  let transformValue: string;
  const effectiveDragOffset = externalDragOffset !== 0 ? externalDragOffset : dragOffset;
  
  if (isDragging || externalDragOffset !== 0) {
    if (isOpen) {
      // When open, dragging right moves it off-screen (positive translateX)
      transformValue = `translateX(${effectiveDragOffset}px)`;
    } else {
      // When closed, dragging left slides it in
      // drawer starts at 100%, we subtract the visible amount
      const visibleAmount = Math.abs(effectiveDragOffset);
      transformValue = `translateX(calc(100% - ${visibleAmount}px))`;
    }
  } else {
    // When not dragging, use normal state
    transformValue = isOpen ? 'translateX(0)' : 'translateX(100%)';
  }
  
  const transition = (isDragging || externalDragOffset !== 0) ? 'none' : `transform ${ANIMATION_DURATION_MEDIUM} ease-out`;

  return (
    <div
      ref={drawerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '90%',
        maxWidth: '90vw',
        backgroundColor: PRIMARY_GREEN,
        zIndex: Z_INDEX_LOADING_SCREEN,
        transform: transformValue,
        transition,
        animation: isOpen && !isDragging ? `slideInFromRightDrawer ${ANIMATION_DURATION_MEDIUM} ease-out` : 'none',
        boxShadow: CART_DRAWER_SHADOW,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        touchAction: 'pan-x',
        userSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        borderTopLeftRadius: 'clamp(1rem, 4vw, 2rem)',
        borderBottomLeftRadius: 'clamp(1rem, 4vw, 2rem)',
      }}
    >
      <CartHeader total={totalPrice} />
      <CheckeredDivider />
      <main
        style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {hasItems ? (
          <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
              {items.map((item, index) => (
                <CartItemCard
                  key={item.burger._id?.toString() || ''}
                  item={item}
                  onRemove={() => removeItem(item.burger._id?.toString() || '')}
                  onUpdateQuantity={(quantity) => updateQuantity(item.burger._id?.toString() || '', quantity)}
                  onAddNote={() => handleAddNote(item.burger._id?.toString() || '')}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FDFCF8',
              fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontStyle: 'italic',
            }}
          >
            Your cart is empty
          </div>
        )}
      </main>
      {hasItems && (
        <>
          <CartFooter onBuyNow={handleBuyNow} onWhatsApp={handleWhatsApp} />
          <CheckeredDivider opacity={0.1} />
        </>
      )}
    </div>
  );
};

