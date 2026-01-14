import { useEffect, useRef, useState } from 'react';
import { CHECK_FOR_ITEMS_DELAY_MS, FIRST_ITEM_ANIMATION_DELAY_MS } from '../constants/animations.constants';
import { INTERSECTION_THRESHOLD } from '../constants/dimensions.constants';
import { DEFAULT_PARSE_VALUE } from '../constants/defaults.constants';

export const useCartButtonVisibility = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleItemsRef = useRef<Set<number>>(new Set());
  const firstItemAnimatedRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkForItems = () => {
      const menuItems = document.querySelectorAll('[data-menu-item]');
      const hasMenuItems = menuItems.length > 0;
      
      if (!hasMenuItems) {
        timeoutRef.current = setTimeout(checkForItems, CHECK_FOR_ITEMS_DELAY_MS);
        return;
      }

      const currentObserver = observerRef.current;
      const hasExistingObserver = currentObserver !== null;
      
      if (hasExistingObserver) {
        currentObserver.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const itemIndexAttr = entry.target.getAttribute('data-menu-item');
            const itemIndex = parseInt(itemIndexAttr || DEFAULT_PARSE_VALUE);
            const isFirstItem = itemIndex === 0;
            const isIntersecting = entry.isIntersecting;

            if (isIntersecting) {
              visibleItemsRef.current.add(itemIndex);
              
              setIsVisible(true);
              
              const shouldAnimateFirstItem = isFirstItem && !firstItemAnimatedRef.current;
              const shouldAnimateNonFirstItem = !isFirstItem;
              
              if (shouldAnimateFirstItem) {
                firstItemAnimatedRef.current = true;
                setTimeout(() => {
                  setHasAnimated(true);
                }, FIRST_ITEM_ANIMATION_DELAY_MS);
              } else if (shouldAnimateNonFirstItem) {
                setHasAnimated(true);
              }
            } else {
              visibleItemsRef.current.delete(itemIndex);
              
              const hasNoVisibleItems = visibleItemsRef.current.size === 0;
              
              if (hasNoVisibleItems) {
                setIsVisible(false);
              }
            }
          });
        },
        { threshold: INTERSECTION_THRESHOLD }
      );

      const newObserver = observerRef.current;
      menuItems.forEach((item) => {
        if (newObserver) {
          newObserver.observe(item);
        }
      });
    };

    checkForItems();

    return () => {
      const currentObserver = observerRef.current;
      const hasObserver = currentObserver !== null;
      
      if (hasObserver) {
        currentObserver.disconnect();
      }

      const currentTimeout = timeoutRef.current;
      const hasTimeout = currentTimeout !== null;
      
      if (hasTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []);

  return { isVisible, hasAnimated };
};

