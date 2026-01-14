'use client';

import React from 'react';
import { ANIMATION_DURATION_MEDIUM } from '../constants/animations.constants';
import { Z_INDEX_CART_OVERLAY } from '../constants/zIndex.constants';
import { OVERLAY_BACKGROUND_COLOR } from '../constants/colors.constants';

interface DrawerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DrawerOverlay: React.FC<DrawerOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: OVERLAY_BACKGROUND_COLOR,
        zIndex: Z_INDEX_CART_OVERLAY,
        animation: `fadeIn ${ANIMATION_DURATION_MEDIUM} ease-out`,
      }}
    />
  );
};

