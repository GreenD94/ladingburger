'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { useMenuTheme } from '../hooks/useMenuTheme';

export const CartButton: React.FC = () => {
  const { openCart, getTotalItems } = useCart();
  const { theme } = useMenuTheme();
  const itemCount = getTotalItems();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const visibleItemsRef = useRef<Set<number>>(new Set());
  const firstItemAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    // Observe all menu items to trigger button visibility
    const checkForItems = () => {
      const menuItems = document.querySelectorAll('[data-menu-item]');
      
      if (menuItems.length === 0) {
        // Retry after a short delay if items not loaded yet
        setTimeout(checkForItems, 100);
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const itemIndex = parseInt(entry.target.getAttribute('data-menu-item') || '0');
            const isFirstItem = itemIndex === 0;

            if (entry.isIntersecting) {
              visibleItemsRef.current.add(itemIndex);
              
              // Show button when any item is visible
              setIsVisible(true);
              
              // If already animated before, show immediately
              if (hasAnimated) {
                setHasAnimated(true); // Ensure it's set
              } else {
                // First time appearing - use longer delay only for first item (same as price/ingredients: 1.7s)
                if (isFirstItem && !firstItemAnimatedRef.current) {
                  firstItemAnimatedRef.current = true;
                  setTimeout(() => {
                    setHasAnimated(true);
                  }, 1700);
                } else if (!isFirstItem) {
                  // For other items on first load, show immediately
                  setHasAnimated(true);
                }
              }
            } else {
              // Remove from visible items
              visibleItemsRef.current.delete(itemIndex);
              
              // Only hide if no items are visible
              if (visibleItemsRef.current.size === 0) {
                setIsVisible(false);
                // Don't reset hasAnimated so it appears immediately next time
              }
            }
          });
        },
        { threshold: 0.3 }
      );

      // Observe all menu items
      menuItems.forEach((item) => {
        if (observerRef.current) {
          observerRef.current.observe(item);
        }
      });
    };

    checkForItems();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasAnimated]);

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes slideInFromRightButton {
          from {
            opacity: 0;
            transform: translateX(100px) translateY(-50%);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(-50%);
          }
        }

        @keyframes slideOutToRightButton {
          from {
            opacity: 1;
            transform: translateX(0) translateY(-50%);
          }
          to {
            opacity: 0;
            transform: translateX(100px) translateY(-50%);
          }
        }
      `}</style>
      <button
        ref={buttonRef}
        onClick={openCart}
        style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'clamp(56px, 14vw, 72px)',
          height: 'clamp(56px, 14vw, 72px)',
          borderRadius: '50%',
          backgroundColor: theme.backgroundColor,
          color: '#FFFFFF',
          border: '3px solid #FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9997,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
          padding: 0,
          margin: 0,
          opacity: isVisible && hasAnimated ? 1 : 0,
          transform: isVisible && hasAnimated 
            ? 'translateX(0) translateY(-50%)' 
            : 'translateX(100px) translateY(-50%)',
          transition: isVisible && hasAnimated 
            ? 'opacity 0.8s ease-out, transform 0.8s ease-out'
            : 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          e.currentTarget.style.opacity = '1';
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(0.95)';
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
        onAnimationEnd={(e) => {
          // Ensure transform is correct after animation
          e.currentTarget.style.transform = 'translateY(-50%)';
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: 'clamp(32px, 8vw, 40px)',
            height: 'clamp(32px, 8vw, 40px)',
          }}
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        
        {/* Badge for item count */}
        {itemCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#FFFFFF',
              color: theme.backgroundColor,
              borderRadius: '50%',
              width: 'clamp(24px, 6vw, 28px)',
              height: 'clamp(24px, 6vw, 28px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(11px, 2.8vw, 13px)',
              fontWeight: 'bold',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              border: `2px solid ${theme.backgroundColor}`,
              animation: itemCount > 0 ? 'pulse 2s ease-in-out infinite' : 'none',
            }}
          >
            {itemCount > 9 ? '9+' : itemCount}
          </div>
        )}
      </button>
    </>
  );
};

