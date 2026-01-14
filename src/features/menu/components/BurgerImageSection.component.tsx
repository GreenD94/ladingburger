'use client';

import React from 'react';
import { MenuThemeConfig } from '../themes/menuThemes';
import { CheckerboardBackground } from './CheckerboardBackground.component';
import { Z_INDEX_BACKGROUND, Z_INDEX_CONTENT } from '../constants/zIndex.constants';

interface BurgerImageSectionProps {
  theme: MenuThemeConfig;
  imageUrl: string;
  imageAlt: string;
  isVisible: boolean;
  imageDelay: string;
  paddingLeft: string;
  paddingRight: string;
  shouldAnimateCheckers: boolean;
}

export const BurgerImageSection: React.FC<BurgerImageSectionProps> = ({
  theme,
  imageUrl,
  imageAlt,
  isVisible,
  imageDelay,
  paddingLeft,
  paddingRight,
  shouldAnimateCheckers,
}) => {
  return (
    <div
      style={{
        height: '50dvh',
        width: '100%',
        position: 'relative',
        backgroundColor: theme.backgroundColor,
        paddingTop: `env(safe-area-inset-top, 0px)`,
        marginBottom: '0px',
        paddingBottom: '0px',
      }}
    >
      <CheckerboardBackground
        backgroundColor={theme.backgroundColor}
        height="25dvh"
        position="top"
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        zIndex={Z_INDEX_BACKGROUND}
        shouldAnimate={shouldAnimateCheckers}
      />
      
      <div
        style={{
          position: 'absolute',
          top: '25dvh',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: Z_INDEX_CONTENT,
        }}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          style={{
            maxWidth: 'clamp(600px, 90vw, 1200px)',
            maxHeight: 'clamp(600px, 90vh, 1200px)',
            width: 'auto',
            height: 'auto',
            display: 'block',
            objectFit: 'contain',
            opacity: 0,
            animation: isVisible ? `fadeIn 0.5s ease-out ${imageDelay} forwards` : 'none',
          }}
        />
      </div>
    </div>
  );
};

