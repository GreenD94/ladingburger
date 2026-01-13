'use client';

import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

export const CartDrawer: React.FC = () => {
  const { isOpen, closeCart } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <style jsx global>{`
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998,
            animation: 'fadeIn 0.3s ease-out',
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '90%',
          maxWidth: '90vw',
          backgroundColor: '#FFFFFF',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-out',
          animation: isOpen ? 'slideInFromLeft 0.3s ease-out' : 'none',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
          overflowY: 'auto',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div
          style={{
            padding: 'clamp(24px, 5vw, 48px)',
            minHeight: '100%',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 600,
              margin: 0,
              marginBottom: '24px',
              color: '#2C1810',
            }}
          >
            Vista de carrito de compras
          </h2>
        </div>
      </div>
    </>
  );
};

