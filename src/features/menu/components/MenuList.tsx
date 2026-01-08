'use client';

import React, { useEffect, useState } from 'react';
import { getAvailableBurgers } from '@/features/database/actions/menu/getAvailableBurgers';
import { Burger } from '@/features/database/types';
import { MenuItem } from './MenuItem';

export const MenuList: React.FC = () => {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);
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
      }
    };

    fetchBurgers();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '64px',
          paddingBottom: '64px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #FF6B00',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px',
          }}
        />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h6 style={{ color: '#2C1810', margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>
          Cargando nuestro menú...
        </h6>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (burgers.length === 0) {
    return (
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
    );
  }

  return (
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
  );
};
