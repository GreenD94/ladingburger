'use client';

import { useState, useEffect } from 'react';
import LandingContainer from '@/features/landing/container/Landing.container';
import Loading from '@/app/loading';
import { Burger } from '@/features/database/types';

export default function Home() {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBurgers() {
      try {
        const response = await fetch('/api/burgers');
        if (!response.ok) {
          throw new Error('Failed to fetch burgers');
        }
        const data = await response.json();
        setBurgers(data);
      } catch (error) {
        console.error('Error fetching burgers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBurgers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <LandingContainer initialBurgers={burgers} />;
}
