'use client';

import React from 'react';
import { Z_INDEX_CONTENT } from '../constants/zIndex.constants';
import { ANIMATION_DURATION_LONG } from '../constants/animations.constants';

interface IngredientsTextProps {
  text: string;
  isVisible: boolean;
  delay: string;
}

export const IngredientsText: React.FC<IngredientsTextProps> = ({
  text,
  isVisible,
  delay,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: Z_INDEX_CONTENT,
        flex: 1,
        fontSize: 'clamp(0.875rem, 1.8vw, 1.25rem)',
        fontWeight: 400,
        fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        lineHeight: 1.6,
        letterSpacing: '0.05em',
        textAlign: 'left',
        opacity: 0,
        transform: 'translateY(50px)',
        animation: isVisible ? `slideInFromTop ${ANIMATION_DURATION_LONG} ease-out ${delay} forwards` : 'none',
      }}
    >
      {text}
    </div>
  );
};

