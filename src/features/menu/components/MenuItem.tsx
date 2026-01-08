'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Burger } from '@/features/database/types';

interface MenuItemProps {
  burger: Burger;
  index: number;
}

const BACKGROUND_COLORS = [
  '#a98de6',
  '#47c2eb',
  '#a5dc67',
  '#ed5063',
  '#ed5063',
];

export const MenuItem: React.FC<MenuItemProps> = ({ burger, index }) => {
  const backgroundColor = BACKGROUND_COLORS[index % BACKGROUND_COLORS.length];
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
          alignItems: 'flex-start',
          backgroundColor: backgroundColor,
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          paddingLeft: 'clamp(24px, 4vw, 32px)',
          paddingRight: 'clamp(24px, 4vw, 32px)',
          paddingTop: 'clamp(32px, 6vw, 48px)',
          paddingBottom: 'clamp(32px, 6vw, 48px)',
          borderRadius: '10px',
        }}
      >
        <div
          style={{
            width: '100%',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '100%',
              marginTop: 0,
              marginBottom: 'clamp(12px, 2vw, 16px)',
            }}
          >
            {burger.name
              .split(' ')
              .map(word => word.toLowerCase() === 'hamburguesa' ? 'burger' : word)
              .map((word, wordIndex) => (
                <div
                  key={wordIndex}
                  style={{
                    fontSize: 'clamp(3.5rem, 8vw, 5rem)',
                    fontWeight: 400,
                    fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
                    color: 'white',
                    textAlign: 'center',
                    textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                    letterSpacing: '0.02em',
                    lineHeight: 1,
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 0,
                    marginTop: 0,
                    opacity: 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-100px)',
                    animation: isVisible ? `slideInFromLeft 0.8s ease-out ${wordIndex * 0.1}s forwards` : 'none',
                  }}
                >
                  {word}
                </div>
              ))}
          </div>

          <div
            style={{
              fontSize: 'clamp(4.5rem, 10vw, 7rem)',
              fontWeight: 400,
              fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
              color: 'white',
              textAlign: 'center',
              marginBottom: '2px',
              marginTop: 'clamp(4px, 1vw, 8px)',
              textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
              letterSpacing: '0.02em',
              lineHeight: 1,
              width: '100%',
              opacity: 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(100px)',
              animation: isVisible ? 'slideInFromRight 0.8s ease-out 0.3s forwards' : 'none',
            }}
          >
            ${burger.price.toFixed(2)}
          </div>
        </div>

        <div
          style={{
            marginTop: '2px',
            marginBottom: '2px',
            alignSelf: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: '1 1 0',
            minHeight: 0,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <img
            src={burger.image}
            alt={burger.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
              opacity: 0,
              animation: isVisible ? 'fadeIn 1s ease-out 0.5s forwards' : 'none',
            }}
          />
        </div>

        <div
          style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            fontWeight: 400,
            fontFamily: '"Times New Roman", Times, serif',
            color: 'white',
            textAlign: 'center',
            maxWidth: 'clamp(100%, 800px, 800px)',
            textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
            lineHeight: 1.6,
            width: '100%',
            flexShrink: 0,
            marginTop: 'auto',
            marginBottom: 0,
            alignSelf: 'center',
            opacity: 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
            animation: isVisible ? 'slideInFromTop 0.8s ease-out 0.7s forwards' : 'none',
          }}
        >
          {burger.description}
        </div>
      </div>
    </>
  );
};
