import { useState, useCallback } from 'react';

export type DrawerView = 'cart' | 'phone-input' | 'confirm-order';

interface UseDrawerStateReturn {
  currentView: DrawerView;
  goToView: (view: DrawerView) => void;
  goBack: () => void;
  resetToCart: () => void;
}

const VIEW_HISTORY: DrawerView[] = ['cart'];

export const useDrawerState = (): UseDrawerStateReturn => {
  const [currentView, setCurrentView] = useState<DrawerView>('cart');
  const [viewHistory, setViewHistory] = useState<DrawerView[]>(VIEW_HISTORY);

  const goToView = useCallback((view: DrawerView) => {
    setCurrentView(view);
    setViewHistory(prev => [...prev, view]);
  }, []);

  const goBack = useCallback(() => {
    setViewHistory(prev => {
      if (prev.length <= 1) {
        return prev;
      }
      const newHistory = [...prev];
      newHistory.pop();
      const previousView = newHistory[newHistory.length - 1];
      setCurrentView(previousView);
      return newHistory;
    });
  }, []);

  const resetToCart = useCallback(() => {
    setCurrentView('cart');
    setViewHistory(VIEW_HISTORY);
  }, []);

  return {
    currentView,
    goToView,
    goBack,
    resetToCart,
  };
};

