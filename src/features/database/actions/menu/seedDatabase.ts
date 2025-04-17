'use server';

import clientPromise from '../../config/mongodb';
import { Burger } from '../../types/index';

const initialBurgers: Omit<Burger, '_id'>[] = [
  {
    name: 'Hamburguesa Clásica',
    description: 'Una hamburguesa clásica de carne con lechuga, tomate y nuestra salsa especial',
    price: 10.99,
    category: 'hamburguesas',
    isAvailable: true,
    image: '/media/burgers/classic-burger.jpg',
    ingredients: ['carne de res', 'lechuga', 'tomate', 'salsa especial'],
  },
  {
    name: 'Hamburguesa con Queso',
    description: 'Nuestra hamburguesa clásica con una rebanada de queso cheddar derretido',
    price: 11.99,
    category: 'hamburguesas',
    isAvailable: true,
    image: '/media/burgers/double-cheese.jpg',
    ingredients: ['carne de res', 'queso cheddar', 'lechuga', 'tomate', 'salsa especial'],
  },
  {
    name: 'Hamburguesa con Tocino',
    description: 'Hamburguesa clásica con tiras de tocino crujiente',
    price: 12.99,
    category: 'hamburguesas',
    isAvailable: true,
    image: '/media/burgers/double-cheese.jpg',
    ingredients: ['carne de res', 'tocino', 'lechuga', 'tomate', 'salsa especial'],
  },
];

export async function seedDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    
    // Clear existing burgers
    await db.collection('burgers').deleteMany({});
    
    // Insert new burgers
    const result = await db.collection<Burger>('burgers').insertMany(initialBurgers);

    return {
      success: true,
      message: `Base de datos sembrada exitosamente con ${result.insertedCount} hamburguesas`,
    };
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error);
    return {
      success: false,
      error: 'Error al sembrar la base de datos',
    };
  }
} 