'use client';

import React from 'react';
import { MenuThemeConfig } from '../themes/menuThemes';
import { ANIMATION_DURATION_EXTRA_LONG, ANIMATION_DURATION_ONE_SECOND } from '../constants/animations.constants';
import { Z_INDEX_LOADING_SCREEN } from '../constants/zIndex.constants';

interface LoadingScreenProps {
  theme: MenuThemeConfig;
  loading: boolean;
  isExiting: boolean;
  showLoader: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  theme,
  loading,
  isExiting,
  showLoader,
}) => {
  if (!showLoader) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.loadingScreenBackgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: Z_INDEX_LOADING_SCREEN,
        transform: isExiting ? 'translateX(-100%)' : 'translateX(0)',
        transition: `transform ${ANIMATION_DURATION_EXTRA_LONG} ease-in-out`,
      }}
    >
      <img
        src="/media/logo/logo.png"
        alt="Logo"
        style={{
          maxWidth: '80%',
          maxHeight: '80%',
          width: 'auto',
          height: 'auto',
          opacity: loading ? 0 : 1,
          animation: loading ? `fadeIn ${ANIMATION_DURATION_ONE_SECOND} ease-out forwards` : 'none',
        }}
      />
    </div>
  );
};

