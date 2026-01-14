import { Burger } from '@/features/database/types/index.type';

export const useIngredientsText = (burger: Burger): string => {
  const hasIngredients = burger.ingredients && burger.ingredients.length > 0;
  const ingredientsText = hasIngredients
    ? burger.ingredients.join(', ').toUpperCase()
    : burger.description.toUpperCase();

  return ingredientsText;
};

