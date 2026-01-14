'use client';

import { useState, useEffect } from 'react';
import { Burger } from '@/features/database/types/index.type';
import { getBurgers } from '@/features/database/actions/burgers.action';


interface BurgersMap {
  [key: string]: Burger;
}

export const useBurgers = () => {
  const [burgers, setBurgers] = useState<BurgersMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const fetchedBurgers = await getBurgers();
        if (!fetchedBurgers) {
          throw new Error('Failed to fetch burgers');
        }
        
        const burgersMap = fetchedBurgers.reduce<BurgersMap>((acc: BurgersMap, burger: Burger) => {
          if (burger._id) {
            acc[burger._id.toString()] = burger;
          }
          return acc;
        }, {});
        
        setBurgers(burgersMap);
        setError('');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch burgers';
        setError(errorMessage);
        console.error('Error fetching burgers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBurgers();
  }, []);

  return { burgers, loading, error };
};

