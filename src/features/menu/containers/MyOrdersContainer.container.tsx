'use client';

import React from 'react';
import { User } from '@/features/database/types/index.type';
import { PRIMARY_GREEN, OFF_WHITE } from '../constants/cartColors.constants';

interface MyOrdersContainerProps {
  user: User;
}

export const MyOrdersContainer: React.FC<MyOrdersContainerProps> = ({ user }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: PRIMARY_GREEN,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <p
        style={{
          color: OFF_WHITE,
          fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 700,
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        Hi i am my orders
      </p>
    </div>
  );
};

