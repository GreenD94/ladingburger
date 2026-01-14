'use client';

import React from 'react';
import { MenuThemeConfig } from '../themes/menuThemes';
import { BurgerNameDisplay } from './BurgerNameDisplay.component';
import { BurgerTitle } from './BurgerTitle.component';

interface BurgerTitleSectionProps {
  theme: MenuThemeConfig;
  burgerPart: string;
  restPart: string;
  isVisible: boolean;
  titleDelay: string;
}

export const BurgerTitleSection: React.FC<BurgerTitleSectionProps> = ({
  theme,
  burgerPart,
  restPart,
  isVisible,
  titleDelay,
}) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: '0px',
        paddingTop: '0px',
        marginBottom: '0px',
        paddingBottom: '0px',
        backgroundColor: theme.backgroundColor,
        opacity: 0,
        transform: 'translateX(-100px)',
        animation: isVisible ? `slideInFromLeft 0.8s ease-out ${titleDelay} forwards` : 'none',
      }}
    >
      <BurgerNameDisplay burgerPart={burgerPart} />
      <BurgerTitle restPart={restPart} primaryColor={theme.primaryColor} />
    </div>
  );
};

