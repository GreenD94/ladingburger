import clientPromise from './config/mongodb';
import { Burger, BURGER_IMAGES } from './types/index.type';

const initialBurgers: Omit<Burger, '_id'>[] = [
  {
    name: "La Caraqueña",
    description: "Hamburguesa estilo venezolano con queso guayanés, plátano maduro y aguacate",
    price: 12.99,
    ingredients: ["Carne de res", "Queso guayanés", "Plátano maduro", "Aguacate", "Lechuga", "Tomate", "Cebolla", "Salsa especial"],
    image: BURGER_IMAGES.CLASSIC,
    category: "Especialidades",
    isAvailable: true
  },
  {
    name: "La Maracucha",
    description: "Hamburguesa con carne de res, queso amarillo, tocineta y huevo frito",
    price: 11.99,
    ingredients: ["Carne de res", "Queso amarillo", "Tocineta", "Huevo frito", "Lechuga", "Tomate", "Cebolla", "Salsa especial"],
    image: BURGER_IMAGES.CLASSIC,
    category: "Clásicas",
    isAvailable: true
  },
  {
    name: "La Andina",
    description: "Hamburguesa con carne de res, queso de mano, aguacate y papas fritas",
    price: 13.99,
    ingredients: ["Carne de res", "Queso de mano", "Aguacate", "Papas fritas", "Lechuga", "Tomate", "Cebolla", "Salsa especial"],
    image: BURGER_IMAGES.CLASSIC,
    category: "Especialidades",
    isAvailable: true
  },
  {
    name: "La Oriental",
    description: "Hamburguesa con carne de res, queso guayanés, plátano maduro y tocineta",
    price: 12.99,
    ingredients: ["Carne de res", "Queso guayanés", "Plátano maduro", "Tocineta", "Lechuga", "Tomate", "Cebolla", "Salsa especial"],
    image: BURGER_IMAGES.CLASSIC,
    category: "Especialidades",
    isAvailable: true
  }
];

export async function seedDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');

    await db.collection('burgers').deleteMany({});

    const result = await db.collection('burgers').insertMany(initialBurgers);

    console.log(`Successfully seeded ${result.insertedCount} burgers`);
    return {
      success: true,
      insertedCount: result.insertedCount
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      error: 'Failed to seed database'
    };
  }
} 