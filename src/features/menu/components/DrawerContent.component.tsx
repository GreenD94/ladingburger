'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext.context';
import { useUser } from '../contexts/UserContext.context';
import { CartHeader } from './CartHeader.component';
import { CheckeredDivider } from './CheckeredDivider.component';
import { CartItemCard } from './CartItemCard.component';
import { CartFooter } from './CartFooter.component';
import { PhoneInputView } from './PhoneInputView.component';
import { ConfirmOrderView } from './ConfirmOrderView.component';
import { ANIMATION_DURATION_MEDIUM } from '../constants/animations.constants';
import { Z_INDEX_LOADING_SCREEN } from '../constants/zIndex.constants';
import { CART_DRAWER_SHADOW } from '../constants/colors.constants';
import { PRIMARY_GREEN } from '../constants/cartColors.constants';
import { EMPTY_CART_MESSAGE } from '../constants/messages.constants';
import { DRAWER_WIDTH_PERCENTAGE, DRAWER_MAX_WIDTH_PERCENTAGE } from '../constants/drawer.constants';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import { useDrawerDrag } from '../hooks/useDrawerDrag.hook';
import { useDrawerTransform } from '../hooks/useDrawerTransform.hook';
import { useWhatsAppLink } from '../hooks/useWhatsAppLink.hook';
import { useDrawerState } from '../hooks/useDrawerState.hook';
import { logError } from '../utils/logError.util';

interface DrawerContentProps {
  isOpen: boolean;
  externalDragOffset?: number;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ isOpen, externalDragOffset = 0 }) => {
  const { items, closeCart, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated, refreshUser } = useUser();
  const totalPrice = getTotalPrice();
  const hasItems = items.length > 0;
  const drawerRef = useRef<HTMLDivElement>(null);
  const whatsappLink = useWhatsAppLink(isOpen);
  const router = useRouter();
  const { currentView, goToView, goBack, resetToCart } = useDrawerState();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { dragOffset, isDragging, isDraggingRef, handleMouseDown, handleTouchStart } = useDrawerDrag({
    isOpen,
    drawerRef,
    onClose: () => {
      resetToCart();
      closeCart();
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      resetToCart();
    }
  }, [isOpen, resetToCart]);

  const { transformValue, transition } = useDrawerTransform({
    isOpen,
    isDragging,
    isDraggingRef,
    dragOffset,
    externalDragOffset,
  });

  const shouldShowAnimation = isOpen && !isDragging && dragOffset === 0;
  const hasWhatsAppLink = whatsappLink !== EMPTY_STRING;

  const handleBuyNow = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    
    if (isAuthenticated) {
      goToView('confirm-order');
    } else {
      goToView('phone-input');
    }
  };

  const handleWhatsApp = () => {
    if (hasWhatsAppLink) {
      window.open(whatsappLink, '_blank');
    }
  };

  const handlePhoneContinue = async (phoneNumber: string) => {
    setIsProcessing(true);
    try {
      const { loginUser } = await import('../actions/userAuth.action');
      const result = await loginUser(phoneNumber);
      if (result.success) {
        await refreshUser();
        goToView('confirm-order');
      } else {
        logError('Login failed:', result.error);
      }
    } catch (error) {
      logError('Error logging in:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOrderConfirm = async (comment: string) => {
    setIsProcessing(true);
    try {
      const { createOrderFromCart } = await import('../actions/createOrderFromCart.action');
      
      const hasPhoneNumber = isAuthenticated && user.phoneNumber !== EMPTY_STRING;
      
      if (!hasPhoneNumber) {
        logError('No phone number found:', new Error('Phone number is empty'));
        return;
      }

      const result = await createOrderFromCart({
        items,
        phoneNumber: user.phoneNumber,
        comment,
      });

      if (result.success) {
        clearCart();
        resetToCart();
        closeCart();
        router.push(`/my-orders?phoneNumber=${user.phoneNumber}`);
      } else {
        logError('Order creation failed:', result.error);
        throw new Error(result.error || 'Failed to create order');
      }
    } catch (error) {
      logError('Error confirming order:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleDrawerTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const shouldShowCartHeader = currentView === 'cart';
  const shouldShowCartContent = currentView === 'cart';

  return (
    <div
      ref={drawerRef}
      onClick={handleDrawerClick}
      onTouchEnd={handleDrawerTouch}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: 'fixed',
        top: 'env(safe-area-inset-top, 0px)',
        right: 'env(safe-area-inset-right, 0px)',
        height: 'calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))',
        width: `${DRAWER_WIDTH_PERCENTAGE * 100}%`,
        maxWidth: `${DRAWER_MAX_WIDTH_PERCENTAGE * 100}vw`,
        backgroundColor: PRIMARY_GREEN,
        zIndex: Z_INDEX_LOADING_SCREEN,
        transform: transformValue,
        transition,
        animation: shouldShowAnimation ? `slideInFromRightDrawer ${ANIMATION_DURATION_MEDIUM} ease-out` : 'none',
        boxShadow: CART_DRAWER_SHADOW,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        touchAction: 'none',
        userSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        borderTopLeftRadius: 'clamp(1rem, 4vw, 2rem)',
        borderBottomLeftRadius: 'clamp(1rem, 4vw, 2rem)',
        pointerEvents: 'auto',
      }}
      >
      {shouldShowCartHeader && (
        <>
          <CartHeader total={totalPrice} onWhatsApp={hasWhatsAppLink ? handleWhatsApp : undefined} />
          <CheckeredDivider />
        </>
      )}
      {currentView === 'cart' && (
        <>
          <main
            data-scrollable
            style={{
              flex: 1,
              padding: '24px',
              paddingRight: 'calc(24px + env(safe-area-inset-right, 0px))',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              touchAction: 'pan-y',
            }}
          >
            {hasItems ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {items.map((item, index) => (
                  <CartItemCard
                    key={item.burger._id?.toString() || EMPTY_STRING}
                    item={item}
                    onRemove={() => removeItem(item.burger._id?.toString() || EMPTY_STRING)}
                    onUpdateQuantity={(quantity) => updateQuantity(item.burger._id?.toString() || EMPTY_STRING, quantity)}
                    index={index}
                  />
                ))}
              </div>
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
                {EMPTY_CART_MESSAGE}
              </div>
            )}
          </main>
          {hasItems && (
            <>
              <CartFooter onBuyNow={handleBuyNow} onWhatsApp={handleWhatsApp} onBuyNowClick={handleBuyNow} />
              <CheckeredDivider opacity={0.1} />
            </>
          )}
        </>
      )}
      {currentView === 'phone-input' && (
        <PhoneInputView
          onContinue={handlePhoneContinue}
          onGoBack={goBack}
        />
      )}
      {currentView === 'confirm-order' && (
        <ConfirmOrderView
          onGoBack={goBack}
          onConfirm={handleOrderConfirm}
        />
      )}
    </div>
  );
};
