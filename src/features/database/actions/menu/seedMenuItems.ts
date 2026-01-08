'use server';

import clientPromise from '../../config/mongodb';
import { Burger } from '../../types';
import { BURGER_IMAGES } from '../../types/burger';

const menuItems: Omit<Burger, '_id'>[] = [
  {
    name: 'Hamburguesa Clásica',
    description: 'Carne blend 150g (80% solomo 20% cerdo) Lechuga, tomate, queso americano, tocineta, pan brioche y 120 gramos de papas.',
    price: 5,
    image: BURGER_IMAGES.CLASSIC,
    category: 'clásica',
    ingredients: [
      'Carne blend 150g (80% solomo 20% cerdo)',
      'Lechuga',
      'Tomate',
      'Queso americano',
      'Tocineta',
      'Pan brioche',
      'Papas 120g'
    ],
    isAvailable: true
  },
  {
    name: 'Hamburguesa Crispy',
    description: '140g de pollo Crispy, lechuga, tomate, queso cheddar, tocineta, pan brioche y 120 gramos de papas.',
    price: 5,
    image: BURGER_IMAGES.CLASSIC,
    category: 'especialidad',
    ingredients: [
      'Pollo Crispy 140g',
      'Lechuga',
      'Tomate',
      'Queso cheddar',
      'Tocineta',
      'Pan brioche',
      'Papas 120g'
    ],
    isAvailable: true
  },
  {
    name: 'Hamburguesa con Queso',
    description: '120 gramos de carne blend x2 tocineta, queso americano, queso cheddar, pepinillos, salsa BBQ De la casa y pan brioche y 120 gramos de papas.',
    price: 7,
    image: BURGER_IMAGES.DOUBLE_CHEESE,
    category: 'queso',
    ingredients: [
      'Carne blend 120g x2',
      'Tocineta',
      'Queso americano',
      'Queso cheddar',
      'Pepinillos',
      'Salsa BBQ De la casa',
      'Pan brioche',
      'Papas 120g'
    ],
    isAvailable: true
  },
  {
    name: 'MaxiSabor\'S',
    description: '140gramos de pollo crispy, 150 de carne blend, tocineta, salsa BBQ de la casa, lechuga, tomate y 120 gramos de papas.',
    price: 8,
    image: BURGER_IMAGES.DOUBLE_CHEESE,
    category: 'especialidad',
    ingredients: [
      'Pollo crispy 140g',
      'Carne blend 150g',
      'Tocineta',
      'Salsa BBQ de la casa',
      'Lechuga',
      'Tomate',
      'Papas 120g'
    ],
    isAvailable: true
  }
];

export async function seedMenuItems() {
  try {
    console.log('Starting menu items seeding...');
    
    const client = await clientPromise;
    const db = client.db('saborea');
    
    // Clear ALL existing burgers from the database
    const deleteResult = await db.collection('burgers').deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing burgers`);
    
    // Insert new menu items
    const result = await db.collection('burgers').insertMany(menuItems);
    console.log(`Inserted ${result.insertedCount} menu items`);
    
    console.log('Menu items seeding completed successfully');
    return { 
      success: true, 
      message: `Successfully seeded ${result.insertedCount} menu items. Cleared ${deleteResult.deletedCount} old items.` 
    };
  } catch (error) {
    console.error('Error seeding menu items:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to seed menu items' 
    };
  }
}

