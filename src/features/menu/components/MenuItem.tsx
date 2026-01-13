'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Burger } from '@/features/database/types';
import { useMenuTheme } from '../hooks/useMenuTheme';
import { CheckerboardBackground } from './CheckerboardBackground';

interface MenuItemProps {
  burger: Burger;
  index: number;
}

const MenuAnimations = () => (
  <style jsx global>{`
    @keyframes slideInFromLeft {
      from {
        opacity: 0;
        transform: translateX(-100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInFromRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
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

    @keyframes slideInFromTop {
      from {
        opacity: 0;
        transform: translateY(-50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInFromLeftNoFade {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes slideInFromRightNoFade {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
  `}</style>
);

interface BurgerNameDisplayProps {
  burgerPart: string;
}

const BurgerNameDisplay: React.FC<BurgerNameDisplayProps> = ({ burgerPart }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 'clamp(4px, 1vw, 8px)',
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        fontWeight: 400,
        fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}
    >
      {burgerPart.split('').map((letter, index) => {
        const totalLetters = burgerPart.length;
        const arcRadius = 30;
        const angle = ((index - (totalLetters - 1) / 2) * 15) * (Math.PI / 180);
        const x = Math.sin(angle) * arcRadius;
        const y = -Math.abs(Math.cos(angle) * arcRadius);
        const rotation = (index - (totalLetters - 1) / 2) * 8;
        
        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        );
      })}
    </div>
  );
};

interface BurgerTitleProps {
  restPart: string;
  primaryColor: string;
}

const BurgerTitle: React.FC<BurgerTitleProps> = ({ restPart, primaryColor }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          fontSize: 'clamp(4rem, 10vw, 7.5rem)',
          fontWeight: 700,
          fontFamily: 'var(--font-playfair-display), "Playfair Display", "Times New Roman", serif',
          color: '#FFFFFF',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: 0.9,
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        {restPart.toUpperCase()}
      </div>
    </div>
  );
};

const parseBurgerName = (name: string) => {
  const trimmedName = name.trim();
  const lowerName = trimmedName.toLowerCase();
  
  let burgerPart = 'BURGER';
  let restPart = '';
  
  if (lowerName.startsWith('hamburguesa')) {
    restPart = trimmedName.substring('hamburguesa'.length).trim();
  } else if (lowerName.startsWith('burger')) {
    restPart = trimmedName.substring('burger'.length).trim();
  } else {
    restPart = trimmedName;
  }
  
  return { 
    burgerPart, 
    restPart: restPart || 'CLÁSICA' 
  };
};

export const MenuItem: React.FC<MenuItemProps> = ({ burger, index }) => {
  const { theme } = useMenuTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimatedCheckers, setHasAnimatedCheckers] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    const currentRef = itemRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Animate checkers only once when component mounts (first item only)
  useEffect(() => {
    if (index === 0) {
      setHasAnimatedCheckers(true);
    }
  }, [index]);

  // Calculate delays: long delays only for first item with checkerboard animation, short for others
  const isFirstItemWithCheckers = index === 0 && hasAnimatedCheckers;
  const titleDelay = isFirstItemWithCheckers ? '1s' : '0s';
  const imageDelay = isFirstItemWithCheckers ? '1.2s' : '0.2s';
  const priceDelay = isFirstItemWithCheckers ? '1.7s' : '0.7s';
  const ingredientsDelay = isFirstItemWithCheckers ? '1.7s' : '0.7s';

  const { burgerPart, restPart } = parseBurgerName(burger.name);
  
  const ingredientsText = burger.ingredients && burger.ingredients.length > 0
    ? burger.ingredients.join(', ').toUpperCase()
    : burger.description.toUpperCase();

  const horizontalPadding = `clamp(24px, 5vw, 48px)`;
  const safeAreaLeft = `env(safe-area-inset-left, 0px)`;
  const safeAreaRight = `env(safe-area-inset-right, 0px)`;
  const paddingLeft = `calc(${horizontalPadding} + ${safeAreaLeft})`;
  const paddingRight = `calc(${horizontalPadding} + ${safeAreaRight})`;

  return (
    <>
      <MenuAnimations />
      <div
        ref={itemRef}
        style={{
          width: '100%',
          height: '100dvh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.backgroundColor,
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          paddingLeft,
          paddingRight,
        }}
      >
        {/* First 50% Section - Checkerboard in first 25% and Burger at bottom */}
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
            zIndex={0}
            shouldAnimate={hasAnimatedCheckers && index === 0}
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
              zIndex: 1,
            }}
          >
            <img
              src={burger.image}
              alt={burger.name}
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

        {/* Title Section - 3px from burger */}
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

        {/* Description and Price Section - Same Row, 3px from title */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'clamp(16px, 3vw, 32px)',
            marginTop: '3px',
            paddingTop: '0px',
            marginBottom: '0px',
            paddingBottom: `calc(clamp(32px, 6vw, 64px) + env(safe-area-inset-bottom, 0px))`,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              flex: 1,
              fontSize: 'clamp(0.875rem, 1.8vw, 1.25rem)',
              fontWeight: 400,
              fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              lineHeight: 1.6,
              letterSpacing: '0.05em',
              textAlign: 'left',
              opacity: 0,
              transform: 'translateY(50px)',
              animation: isVisible ? `slideInFromTop 0.5s ease-out ${ingredientsDelay} forwards` : 'none',
            }}
          >
            {ingredientsText}
          </div>
          
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 'clamp(3.5rem, 8vw, 6rem)',
              fontWeight: 700,
              fontFamily: 'var(--font-playfair-display), "Playfair Display", "Times New Roman", serif',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontStyle: 'italic',
              flexShrink: 0,
              opacity: 0,
              transform: 'translateX(100px)',
              animation: isVisible ? `slideInFromRight 0.5s ease-out ${priceDelay} forwards` : 'none',
            }}
          >
            {burger.price.toFixed(0)}$
          </div>
        </div>

        {/* Checkerboard Background at Bottom - Half Height */}
        <CheckerboardBackground
          backgroundColor={theme.backgroundColor}
          height="12.5dvh"
          position="bottom"
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          zIndex={0}
          shouldAnimate={hasAnimatedCheckers && index === 0}
        />
      </div>
    </>
  );
};
