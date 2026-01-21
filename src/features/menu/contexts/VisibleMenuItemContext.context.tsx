'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { INTERSECTION_THRESHOLD } from '../constants/dimensions.constants';
import { useCart } from './CartContext.context';

interface VisibleMenuItemContextType {
  visibleItemIndex: number;
}

const EMPTY_VISIBLE_ITEM_INDEX = -1;

const EMPTY_VISIBLE_MENU_ITEM_CONTEXT_VALUE: VisibleMenuItemContextType = {
  visibleItemIndex: EMPTY_VISIBLE_ITEM_INDEX,
};

const VisibleMenuItemContext = createContext<VisibleMenuItemContextType>(
  EMPTY_VISIBLE_MENU_ITEM_CONTEXT_VALUE
);

export const VisibleMenuItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visibleItemIndex, setVisibleItemIndex] = useState<number>(EMPTY_VISIBLE_ITEM_INDEX);
  const lastVisibleItemRef = useRef<number>(EMPTY_VISIBLE_ITEM_INDEX);
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
          const itemIndexAttr = (mostVisibleEntry as IntersectionObserverEntry).target.getAttribute('data-menu-item');
          const itemIndex = itemIndexAttr ? parseInt(itemIndexAttr, 10) : EMPTY_VISIBLE_ITEM_INDEX;
          const hasValidIndex = itemIndex !== EMPTY_VISIBLE_ITEM_INDEX;
          if (hasValidIndex) {
            setVisibleItemIndex(itemIndex);
            lastVisibleItemRef.current = itemIndex;
          }
        } else {
          const hasIntersectingItems = entries.some((entry) => entry.isIntersecting);
          if (!hasIntersectingItems && !isOpen) {
            setVisibleItemIndex(EMPTY_VISIBLE_ITEM_INDEX);
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

  const hasLastVisibleItem = lastVisibleItemRef.current !== EMPTY_VISIBLE_ITEM_INDEX;
  const currentVisibleIndex = isOpen && hasLastVisibleItem 
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

