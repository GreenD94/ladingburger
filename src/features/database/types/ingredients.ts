// Replace the import with direct definition
export const INGREDIENT_COSTS: Record<string, number> = {
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

// Lista de ingredientes comunes para hamburguesas (derivada de las claves de los costos)
export const COMMON_INGREDIENTS = Object.keys(INGREDIENT_COSTS);

// Función para calcular el costo total de una lista de ingredientes
export const calculateTotalCost = (
  ingredients: string[], 
  customCosts?: Record<string, number>
): number => {
  return ingredients.reduce((total, ingredient) => {
    // Primero buscar en costos personalizados si existen
    if (customCosts && customCosts[ingredient] !== undefined) {
      return total + customCosts[ingredient];
    }
    // Luego buscar en costos predefinidos
    return total + (INGREDIENT_COSTS[ingredient] || 1.0);
  }, 0);
};

// Calcular el margen de ganancia
export const calculateProfit = (price: number, cost: number): number => {
  if (cost <= 0 || price <= 0) return 0;
  return Math.round(((price - cost) / price) * 100);
};

export interface Ingredient {
  _id?: string; // MongoDB ObjectId como string
  name: string;
  cost: number;
  unit?: string;
  category?: string;
  // Puedes agregar más campos si lo necesitas, como unidad, categoría, etc.
}