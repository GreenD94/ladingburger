import { useEffect, useState } from 'react';
import { getAvailableBurgers } from '../actions/getAvailableBurgers.action';
import { Burger } from '@/features/database/types/index.type';
import { MIN_LOADING_TIME_MS, LOADER_EXIT_DELAY_MS } from '../constants/animations.constants';
import { ERROR_LOAD_PRODUCTS, ERROR_LOAD_MENU } from '../constants/messages.constants';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

interface UseMenuLoadingReturn {
  burgers: Burger[];
  loading: boolean;
  isExiting: boolean;
  showLoader: boolean;
  error: string;
}

export const useMenuLoading = (): UseMenuLoadingReturn => {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState<string>(EMPTY_STRING);

  useEffect(() => {
    const fetchBurgers = async () => {
      const startTime = Date.now();
      
      try {
        setLoading(true);
        const availableBurgers = await getAvailableBurgers();
        const hasBurgers = availableBurgers && availableBurgers.length > 0;
        
        if (hasBurgers) {
          setBurgers(availableBurgers);
        } else {
          setError(ERROR_LOAD_PRODUCTS);
        }
      } catch (err) {
        setError(ERROR_LOAD_MENU);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME_MS - elapsedTime);
        
        setTimeout(() => {
          setLoading(false);
          setIsExiting(true);
          setTimeout(() => {
            setShowLoader(false);
          }, LOADER_EXIT_DELAY_MS);
        }, remainingTime);
      }
    };

    fetchBurgers();
  }, []);

  return { burgers, loading, isExiting, showLoader, error };
};

