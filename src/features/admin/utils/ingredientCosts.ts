// Costos de ingredientes
export const INGREDIENT_COSTS = {
  'Carne': 2,
  'Queso Crema': 1,
  'Queso Cheddar': 2,
  'Tomate': 0.5,
  'Lechuga': 0.5,
  'Cebolla': 0.3,
  'Cebolla Caramelizada': 0.6,
  'BBQ': 0.7,
  'Maíz': 0.5,
  'Bacon': 1.5,
  'Huevo': 1,
  'Pepinillos': 0.3,
  'Champiñones': 0.8,
  'Aguacate': 1.2,
  'Pan': 1,
  'Salsa Especial': 0.5
};

// Función para calcular el costo total de ingredientes
export const calculateTotalCost = (ingredients: string[]): number => {
  return ingredients.reduce((total, ingredient) => {
    return total + (INGREDIENT_COSTS[ingredient as keyof typeof INGREDIENT_COSTS] || 0);
  }, 0);
};

// Función para calcular el costo total incluyendo otros costos
export const calculateTotalCostWithOthers = (ingredients: string[], otherCosts: number = 0): number => {
  const ingredientsCost = calculateTotalCost(ingredients);
  return ingredientsCost + (otherCosts || 0);
};

// Función para formatear el costo en formato legible
export const formatIngredientCosts = (ingredients: string[]): string => {
  return ingredients.slice(0, 3)
    .map(ingredient => {
      const cost = INGREDIENT_COSTS[ingredient as keyof typeof INGREDIENT_COSTS] || 0;
      return `${ingredient}:$${cost.toFixed(1)}`;
    })
    .join(', ');
}; 