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
import { getBusinessContact } from '@/features/database/actions/businessContacts/getBusinessContact.action';

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
  const [whatsappLink, setWhatsappLink] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const EDGE_THRESHOLD = 50; // pixels from right edge to start drag

  useEffect(() => {
    const fetchWhatsAppLink = async () => {
      try {
        const contact = await getBusinessContact();
        if (contact && contact.whatsappLink && contact.whatsappLink !== '') {
          setWhatsappLink(contact.whatsappLink);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp link:', error);
      }
    };

    if (isOpen) {
      fetchWhatsAppLink();
    }
  }, [isOpen]);

  const handleBuyNow = () => {
    // TODO: Implement buy now action
  };

  const handleWhatsApp = () => {
    if (whatsappLink && whatsappLink !== '') {
      window.open(whatsappLink, '_blank');
    }
  };

  const handleAddNote = (burgerId: string) => {
    // TODO: Implement add note action
  };

  const handleStart = (clientX: number, target: EventTarget | null) => {
    if (!isOpen) return; // Only handle drag when drawer is open
    
    const isButton = target instanceof HTMLButtonElement || 
                     (target instanceof HTMLElement && target.closest('button') !== null);
    
    if (isButton) {
      return; // Don't start drag if clicking on a button
    }
    
    // DON'T set isDragging here - only set it when there's actual movement
    // This prevents accidental drag state from simple clicks
    startXRef.current = clientX;
    currentXRef.current = clientX;
    setDragOffset(0);
  };

  const handleMove = (clientX: number) => {
    if (!isOpen) return;
    const deltaX = clientX - startXRef.current;
    const MIN_DRAG_DISTANCE = 5; // Minimum pixels to consider it a drag vs click
    
    // Only set isDragging when there's actual movement
    if (Math.abs(deltaX) >= MIN_DRAG_DISTANCE && !isDraggingRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);
    }
    
    if (!isDraggingRef.current) return;
    
    // When open, only allow dragging to the right (positive deltaX) to close
    if (deltaX > 0) {
      currentXRef.current = clientX;
      setDragOffset(deltaX);
    }
  };

  const handleEnd = () => {
    if (!isDraggingRef.current || !isOpen) return;
    const deltaX = currentXRef.current - startXRef.current;
    const MIN_DRAG_DISTANCE = 5; // Minimum pixels to consider it a drag vs click
    const drawerWidth = drawerRef.current?.offsetWidth || window.innerWidth * 0.9;
    const threshold = drawerWidth * 0.3;
    
    // If it was just a click (no significant movement), don't close
    if (Math.abs(deltaX) < MIN_DRAG_DISTANCE) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setDragOffset(0);
      startXRef.current = 0;
      currentXRef.current = 0;
      return;
    }
    
    // If open and dragged right enough, close it
    if (deltaX > threshold) {
      closeCart();
    }
    
    isDraggingRef.current = false;
    setIsDragging(false);
    setDragOffset(0);
    startXRef.current = 0;
    currentXRef.current = 0;
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isOpen) return;
    // Stop all event propagation to prevent overlay from receiving the event
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    handleStart(e.clientX, e.target);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    // Only call handleEnd if we were actually dragging
    if (isDraggingRef.current) {
      handleEnd();
    } else {
      // Clean up if it was just a click (no drag occurred)
      startXRef.current = 0;
      currentXRef.current = 0;
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isOpen || e.touches.length === 0) return;
    // Stop all event propagation to prevent overlay from receiving the event
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    handleStart(e.touches[0].clientX, e.target);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    // Only call handleEnd if we were actually dragging
    if (isDraggingRef.current) {
      handleEnd();
    } else {
      // Clean up if it was just a tap (no drag occurred)
      startXRef.current = 0;
      currentXRef.current = 0;
    }
  };

  useEffect(() => {
    // Always add move/end listeners when drawer is open to detect movement
    // But only process in handleEnd if isDraggingRef.current is true
    if (isOpen) {
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
  }, [isOpen]);

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

  const handleDrawerClick = (e: React.MouseEvent) => {
    // Stop all event propagation to prevent overlay from receiving the event
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleDrawerTouch = (e: React.TouchEvent) => {
    // Stop all event propagation to prevent overlay from receiving the event
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <div
      ref={drawerRef}
      onClick={handleDrawerClick}
      onTouchEnd={handleDrawerTouch}
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
        pointerEvents: 'auto',
      }}
    >
      <CartHeader total={totalPrice} onWhatsApp={whatsappLink !== '' ? handleWhatsApp : undefined} />
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
            Tu carrito está vacío
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

