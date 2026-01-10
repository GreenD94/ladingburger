'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Burger } from '@/features/database/types';

interface MenuItemProps {
  burger: Burger;
  index: number;
}

const DARK_GREEN = '#1a4d3a';
const ORANGE = '#FF6B35';

export const MenuItem: React.FC<MenuItemProps> = ({ burger, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  const getDisplayParts = () => {
    const name = burger.name.trim();
    const lowerName = name.toLowerCase();
    
    let burgerPart = 'BURGER';
    let restPart = '';
    
    if (lowerName.startsWith('hamburguesa')) {
      burgerPart = 'BURGER';
      restPart = name.substring('hamburguesa'.length).trim();
    } else if (lowerName.startsWith('burger')) {
      burgerPart = 'BURGER';
      restPart = name.substring('burger'.length).trim();
    } else {
      burgerPart = 'BURGER';
      restPart = name;
    }
    
    return { burgerPart, restPart: restPart || 'CLÁSICA' };
  };
  
  const { burgerPart, restPart } = getDisplayParts();

  const ingredientsText = burger.ingredients && burger.ingredients.length > 0
    ? burger.ingredients.join(', ').toUpperCase()
    : burger.description.toUpperCase();

  const starburstPoints = 16;
  const starburstSize = 'clamp(300px, 50vw, 500px)';
  
  const generateStarburstPath = () => {
    const center = 100;
    const outerRadius = 100;
    const innerRadius = 70;
    const points: string[] = [];
    
    for (let i = 0; i < starburstPoints * 2; i++) {
      const angle = (i * Math.PI) / starburstPoints;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = center + radius * Math.cos(angle - Math.PI / 2);
      const y = center + radius * Math.sin(angle - Math.PI / 2);
      points.push(`${x},${y}`);
    }
    
    return points.join(' ');
  };

  return (
    <>
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
      `}</style>
      <div
        ref={itemRef}
        style={{
          width: '100%',
          height: '100vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: DARK_GREEN,
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          padding: 'clamp(24px, 5vw, 48px)',
          paddingTop: 'clamp(48px, 8vw, 96px)',
          paddingBottom: 'clamp(32px, 6vw, 64px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            marginBottom: 'clamp(16px, 3vw, 32px)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-100px)',
            animation: isVisible ? 'slideInFromLeft 0.8s ease-out forwards' : 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 'clamp(4px, 1vw, 8px)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 400,
              fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
              color: ORANGE,
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              gap: 'clamp(12px, 2vw, 24px)',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '2px',
                backgroundColor: ORANGE,
                maxWidth: 'clamp(60px, 15vw, 120px)',
              }}
            />
            <div
              style={{
                fontSize: 'clamp(4rem, 10vw, 7.5rem)',
                fontWeight: 700,
                fontFamily: 'var(--font-playfair-display), "Playfair Display", "Times New Roman", serif',
                color: ORANGE,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 0.9,
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              {restPart.toUpperCase()}
            </div>
            <div
              style={{
                flex: 1,
                height: '2px',
                backgroundColor: ORANGE,
                maxWidth: 'clamp(60px, 15vw, 120px)',
              }}
            />
          </div>
        </div>

        <div
          style={{
            flex: '1 1 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            minHeight: 0,
            marginBottom: 'clamp(16px, 3vw, 32px)',
          }}
        >
          <svg
            style={{
              position: 'absolute',
              width: starburstSize,
              height: starburstSize,
              zIndex: 0,
              opacity: isVisible ? 1 : 0,
              animation: isVisible ? 'fadeIn 1s ease-out 0.4s forwards' : 'none',
            }}
            viewBox="0 0 200 200"
          >
            <polygon
              points={generateStarburstPath()}
              fill={ORANGE}
            />
          </svg>
          <img
            src={burger.image}
            alt={burger.name}
            style={{
              maxWidth: 'clamp(200px, 35vw, 350px)',
              maxHeight: 'clamp(200px, 35vw, 350px)',
              width: 'auto',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
              opacity: 0,
              animation: isVisible ? 'fadeIn 1s ease-out 0.5s forwards' : 'none',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
            gap: 'clamp(16px, 3vw, 32px)',
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: 'clamp(0.875rem, 1.8vw, 1.25rem)',
              fontWeight: 400,
              fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
              color: ORANGE,
              textTransform: 'uppercase',
              lineHeight: 1.6,
              letterSpacing: '0.05em',
              textAlign: 'left',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              animation: isVisible ? 'slideInFromTop 0.8s ease-out 0.7s forwards' : 'none',
            }}
          >
            {ingredientsText}
          </div>
          <div
            style={{
              fontSize: 'clamp(3.5rem, 8vw, 6rem)',
              fontWeight: 700,
              fontFamily: 'var(--font-playfair-display), "Playfair Display", "Times New Roman", serif',
              color: ORANGE,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontStyle: 'italic',
              flexShrink: 0,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(100px)',
              animation: isVisible ? 'slideInFromRight 0.8s ease-out 0.6s forwards' : 'none',
            }}
          >
            {burger.price.toFixed(0)}$
          </div>
        </div>
      </div>
    </>
  );
};

