'use client';

import React from 'react';
import { ARC_RADIUS, ANGLE_MULTIPLIER, ROTATION_MULTIPLIER } from '../constants/dimensions.constants';

interface BurgerNameDisplayProps {
  burgerPart: string;
}

export const BurgerNameDisplay: React.FC<BurgerNameDisplayProps> = ({ burgerPart }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '-0.5rem',
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        fontWeight: 400,
        fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}
    >
      {burgerPart.split('').map((letter, index) => {
        const totalLetters = burgerPart.length;
        const angle = ((index - (totalLetters - 1) / 2) * ANGLE_MULTIPLIER) * (Math.PI / 180);
        const x = Math.sin(angle) * ARC_RADIUS;
        const y = -Math.abs(Math.cos(angle) * ARC_RADIUS);
        const rotation = (index - (totalLetters - 1) / 2) * ROTATION_MULTIPLIER;
        
        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        );
      })}
    </div>
  );
};

