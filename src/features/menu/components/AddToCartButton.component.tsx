'use client';

import React from 'react';
import { MenuThemeConfig } from '../themes/menuThemes';
import { ANIMATION_DURATION_LONG } from '../constants/animations.constants';
import { Z_INDEX_CART_BUTTON } from '../constants/zIndex.constants';
import { TRANSLATE_X_DISTANCE, TRANSLATE_Y_DISTANCE } from '../constants/dimensions.constants';
import { BUTTON_SHADOW } from '../constants/colors.constants';
import { useButtonInteractions } from '../hooks/useButtonInteractions.hook';

interface AddToCartButtonProps {
  theme: MenuThemeConfig;
  priceDelay: string;
  onAddToCart: () => void;
  itemIndex: number;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  theme,
  priceDelay,
  onAddToCart,
  itemIndex,
}) => {
  const baseTransform = `translateX(0) translateY(-${TRANSLATE_Y_DISTANCE})`;
  const buttonInteractions = useButtonInteractions(baseTransform);

  return (
    <button
      onClick={onAddToCart}
      style={{
        position: 'absolute',
        right: 0,
        top: 'calc(50% - 80px)',
        width: 'clamp(56px, 14vw, 72px)',
        height: 'clamp(56px, 14vw, 72px)',
        borderRadius: '50%',
        backgroundColor: theme.backgroundColor,
        border: '3px solid #FFFFFF',
        color: '#FFFFFF',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: Z_INDEX_CART_BUTTON,
        boxShadow: BUTTON_SHADOW,
        padding: 0,
        margin: 0,
        opacity: 0,
        transform: `translateX(${TRANSLATE_X_DISTANCE}) translateY(-${TRANSLATE_Y_DISTANCE})`,
        animation: `slideInFromRight ${ANIMATION_DURATION_LONG} ease-out ${priceDelay} forwards`,
        transition: 'all 0.2s ease-in-out',
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
    </button>
  );
};

