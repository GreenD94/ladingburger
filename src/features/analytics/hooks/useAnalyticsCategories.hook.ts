import { useState, useEffect, useCallback } from 'react';
import { AnalyticsCategoryId, DEFAULT_CATEGORY, getCategoryById } from '@/features/analytics/constants/analyticsCategories.constants';

const STORAGE_KEY = 'analytics_selected_category';

export function useAnalyticsCategories() {
  const [selectedCategory, setSelectedCategory] = useState<AnalyticsCategoryId>(DEFAULT_CATEGORY);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const category = stored as AnalyticsCategoryId;
        const validCategory = getCategoryById(category);
        if (validCategory) {
          setSelectedCategory(category);
        }
      }
    }
  }, []);

  const changeCategory = useCallback((categoryId: AnalyticsCategoryId) => {
    setSelectedCategory(categoryId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, categoryId);
    }
  }, []);

  const currentCategory = getCategoryById(selectedCategory);

  return {
    selectedCategory,
    currentCategory,
    changeCategory,
  };
}

