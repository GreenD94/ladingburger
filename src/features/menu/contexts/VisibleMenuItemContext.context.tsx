'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { INTERSECTION_THRESHOLD } from '../constants/dimensions.constants';
import { useCart } from './CartContext.context';

interface VisibleMenuItemContextType {
  visibleItemIndex: number | null;
}

const EMPTY_VISIBLE_MENU_ITEM_CONTEXT_VALUE: VisibleMenuItemContextType = {
  visibleItemIndex: null,
};

const VisibleMenuItemContext = createContext<VisibleMenuItemContextType>(
  EMPTY_VISIBLE_MENU_ITEM_CONTEXT_VALUE
);

export const VisibleMenuItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visibleItemIndex, setVisibleItemIndex] = useState<number | null>(null);
  const lastVisibleItemRef = useRef<number | null>(null);
  const { isOpen } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleEntry: IntersectionObserverEntry | null = null;
        let highestRatio = 0;

        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          const intersectionRatio = entry.intersectionRatio;
          const isMoreVisible = intersectionRatio > highestRatio;

          if (isIntersecting && isMoreVisible) {
            highestRatio = intersectionRatio;
            mostVisibleEntry = entry;
          }
        });

        if (mostVisibleEntry) {
          const itemIndexAttr = mostVisibleEntry.target.getAttribute('data-menu-item');
          const itemIndex = itemIndexAttr ? parseInt(itemIndexAttr, 10) : null;
          if (itemIndex !== null) {
            setVisibleItemIndex(itemIndex);
            lastVisibleItemRef.current = itemIndex;
          }
        } else {
          const hasIntersectingItems = entries.some((entry) => entry.isIntersecting);
          if (!hasIntersectingItems && !isOpen) {
            setVisibleItemIndex(null);
          }
        }
      },
      { threshold: INTERSECTION_THRESHOLD }
    );

    const checkForItems = () => {
      const menuItems = document.querySelectorAll('[data-menu-item]');
      const hasMenuItems = menuItems.length > 0;

      if (hasMenuItems) {
        menuItems.forEach((item) => observer.observe(item));
      } else {
        setTimeout(checkForItems, 100);
      }
    };

    checkForItems();

    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  const currentVisibleIndex = isOpen && lastVisibleItemRef.current !== null 
    ? lastVisibleItemRef.current 
    : visibleItemIndex;

  return (
    <VisibleMenuItemContext.Provider value={{ visibleItemIndex: currentVisibleIndex }}>
      {children}
    </VisibleMenuItemContext.Provider>
  );
};

export const useVisibleMenuItem = () => {
  const context = useContext(VisibleMenuItemContext);
  const hasContext = context !== undefined;

  if (!hasContext) {
    throw new Error('useVisibleMenuItem must be used within a VisibleMenuItemProvider');
  }

  return context;
};

