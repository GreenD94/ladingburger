export const MATERIAL_CATEGORIES = {
  PROTEIN: 'protein',
  DAIRY: 'dairy',
  BAKERY: 'bakery',
  VEGETABLES: 'vegetables',
  CONDIMENTS: 'condiments',
  BEVERAGES: 'beverages',
  OTHER: 'other',
} as const;

export const MATERIAL_CATEGORY_LABELS: Record<string, string> = {
  [MATERIAL_CATEGORIES.PROTEIN]: 'Proteína',
  [MATERIAL_CATEGORIES.DAIRY]: 'Lácteos',
  [MATERIAL_CATEGORIES.BAKERY]: 'Panadería',
  [MATERIAL_CATEGORIES.VEGETABLES]: 'Verduras',
  [MATERIAL_CATEGORIES.CONDIMENTS]: 'Condimentos',
  [MATERIAL_CATEGORIES.BEVERAGES]: 'Bebidas',
  [MATERIAL_CATEGORIES.OTHER]: 'Otros',
};

