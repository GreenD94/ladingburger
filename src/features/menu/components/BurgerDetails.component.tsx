'use client';

import React from 'react';
import { IngredientsText } from './IngredientsText.component';
import { PriceDisplay } from './PriceDisplay.component';
import { Z_INDEX_CONTENT } from '../constants/zIndex.constants';

interface BurgerDetailsProps {
  ingredientsText: string;
  price: number;
  isVisible: boolean;
  ingredientsDelay: string;
  priceDelay: string;
}

export const BurgerDetails: React.FC<BurgerDetailsProps> = ({
  ingredientsText,
  price,
  isVisible,
  ingredientsDelay,
  priceDelay,
}) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'clamp(16px, 3vw, 32px)',
        marginTop: '5px',
        paddingTop: '0px',
        marginBottom: '0px',
        paddingBottom: `calc(clamp(32px, 6vw, 64px) + env(safe-area-inset-bottom, 0px))`,
        position: 'relative',
        zIndex: Z_INDEX_CONTENT,
      }}
    >
      <IngredientsText text={ingredientsText} isVisible={isVisible} delay={ingredientsDelay} />
      <PriceDisplay price={price} isVisible={isVisible} delay={priceDelay} />
    </div>
  );
};

