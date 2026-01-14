'use client';

import React, { useRef } from 'react';
import { useCart } from '../contexts/CartContext.context';
import { useMenuTheme } from '../hooks/useMenuTheme.hook';
import { CartBadge } from './CartBadge.component';
import { MenuAnimations } from '../styles/menuAnimations.styles';
import { useCartButtonVisibility } from '../hooks/useCartButtonVisibility.hook';
import { useButtonInteractions } from '../hooks/useButtonInteractions.hook';
import { ANIMATION_DURATION_VERY_LONG, ANIMATION_DURATION_LONG } from '../constants/animations.constants';
import { Z_INDEX_CART_BUTTON } from '../constants/zIndex.constants';
import { TRANSLATE_X_DISTANCE, TRANSLATE_Y_DISTANCE } from '../constants/dimensions.constants';
import { BUTTON_SHADOW, TEXT_COLOR_WHITE } from '../constants/colors.constants';
import { DEFAULT_OPACITY } from '../constants/defaults.constants';

export const CartButton: React.FC = () => {
  const { openCart, getTotalItems } = useCart();
  const { theme } = useMenuTheme();
  const itemCount = getTotalItems();
  const { isVisible, hasAnimated } = useCartButtonVisibility();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const baseTransform = `translateY(-${TRANSLATE_Y_DISTANCE})`;
  const buttonInteractions = useButtonInteractions(baseTransform);

  const shouldShowButton = isVisible && hasAnimated;
  const buttonTransform = shouldShowButton
    ? `translateX(0) ${baseTransform}`
    : `translateX(${TRANSLATE_X_DISTANCE}) ${baseTransform}`;
  const buttonTransition = shouldShowButton
    ? `opacity ${ANIMATION_DURATION_VERY_LONG} ease-out, transform ${ANIMATION_DURATION_VERY_LONG} ease-out`
    : `opacity ${ANIMATION_DURATION_LONG} ease-out, transform ${ANIMATION_DURATION_LONG} ease-out`;

  return (
    <>
      <MenuAnimations />
      <button
        ref={buttonRef}
        onClick={openCart}
        style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          width: 'clamp(56px, 14vw, 72px)',
          height: 'clamp(56px, 14vw, 72px)',
          borderRadius: '50%',
          backgroundColor: theme.backgroundColor,
          color: TEXT_COLOR_WHITE,
          border: '3px solid #FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: Z_INDEX_CART_BUTTON,
          boxShadow: BUTTON_SHADOW,
          padding: 0,
          margin: 0,
          opacity: shouldShowButton ? DEFAULT_OPACITY : 0,
          transform: buttonTransform,
          transition: buttonTransition,
        }}
        {...buttonInteractions}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: 'clamp(32px, 8vw, 40px)',
            height: 'clamp(32px, 8vw, 40px)',
          }}
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <CartBadge itemCount={itemCount} theme={theme} />
      </button>
    </>
  );
};

