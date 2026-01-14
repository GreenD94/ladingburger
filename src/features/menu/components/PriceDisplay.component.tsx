'use client';

import React from 'react';
import { Z_INDEX_CONTENT } from '../constants/zIndex.constants';
import { ANIMATION_DURATION_LONG } from '../constants/animations.constants';

interface PriceDisplayProps {
  price: number;
  isVisible: boolean;
  delay: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  isVisible,
  delay,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: Z_INDEX_CONTENT,
        fontSize: 'clamp(3.5rem, 8vw, 6rem)',
        fontWeight: 700,
        fontFamily: 'var(--font-playfair-display), "Playfair Display", "Times New Roman", serif',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontStyle: 'italic',
        flexShrink: 0,
        opacity: 0,
        transform: 'translateX(100px)',
        animation: isVisible ? `slideInFromRight ${ANIMATION_DURATION_LONG} ease-out ${delay} forwards` : 'none',
      }}
    >
      {price.toFixed(0)}$
    </div>
  );
};

