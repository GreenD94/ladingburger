import { useEffect, useState } from 'react';
import { Ingredient } from '@/features/database/types/ingredients';

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ingredients')
      .then(res => res.json())
      .then(data => setIngredients(data))
      .finally(() => setLoading(false));
  }, []);

  return { ingredients, loading };
} 