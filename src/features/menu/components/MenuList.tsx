'use client';

import React, { useEffect, useState } from 'react';
import { getAvailableBurgers } from '@/features/database/actions/menu/getAvailableBurgers';
import { Burger } from '@/features/database/types';
import { MenuItem } from './MenuItem';

export const MenuList: React.FC = () => {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        setLoading(true);
        const availableBurgers = await getAvailableBurgers();
        if (availableBurgers) {
          setBurgers(availableBurgers);
        } else {
          setError('No se pudieron cargar los productos');
        }
      } catch (err) {
        console.error('Error al cargar el menú:', err);
        setError('Error al cargar el menú');
      } finally {
        setLoading(false);
        // Start exit animation
        setIsExiting(true);
        // Remove loader after animation completes
        setTimeout(() => {
          setShowLoader(false);
        }, 600); // Match animation duration
      }
    };

    fetchBurgers();
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
      {showLoader && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#1a4d3a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            transform: isExiting ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 0.6s ease-in-out',
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
              animation: loading ? 'fadeIn 1s ease-out forwards' : 'none',
            }}
          />
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '64px',
            paddingBottom: '64px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          <h6 style={{ color: '#d32f2f', textAlign: 'center', margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>
            {error}
          </h6>
        </div>
      )}

      {!loading && !error && burgers.length === 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '64px',
            paddingBottom: '64px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          <h6 style={{ color: '#2C1810', textAlign: 'center', margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>
            No hay productos disponibles en este momento
          </h6>
        </div>
      )}

      {!loading && !error && burgers.length > 0 && (
        <>
          {burgers.map((burger, index) => (
            <MenuItem key={burger._id?.toString() || index} burger={burger} index={index} />
          ))}
          <div
            style={{
              width: '100%',
              height: '72vh',
              boxSizing: 'border-box',
            }}
          />
        </>
      )}
    </>
  );
};
