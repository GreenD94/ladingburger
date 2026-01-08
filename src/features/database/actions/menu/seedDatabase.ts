'use server';

import { createAdmin } from '../../models/admin.model';
import clientPromise from '../../config/mongodb';
import { Burger } from '../../types';
import { BURGER_IMAGES } from '../../types/burger';

const burgers: Omit<Burger, '_id'>[] = [
  {
    name: 'Classic Burger',
    description: 'Carne blend 150g (80% solomo 20% cerdo) Lechuga, tomate, queso americano, tocineta, pan brioche y 120 gramos de papas.',
    price: 5,
    image: BURGER_IMAGES.CLASSIC,
    category: 'classic',
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
    name: 'Crispy Burger',
    description: '140g de pollo Crispy, lechuga, tomate, queso cheddar, tocineta, pan brioche y 120 gramos de papas.',
    price: 5,
    image: BURGER_IMAGES.CLASSIC,
    category: 'specialty',
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
    name: 'Cheeseburger',
    description: '120 gramos de carne blend x2 tocineta, queso americano, queso cheddar, pepinillos, salsa BBQ De la casa y pan brioche y 120 gramos de papas.',
    price: 7,
    image: BURGER_IMAGES.DOUBLE_CHEESE,
    category: 'cheese',
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
    category: 'specialty',
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

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Create admin user
    console.log('Creating admin user...');
    await createAdmin({
      email: 'admin@admin.com',
      password: '12345'
    });
    console.log('Admin user created successfully');

    // Seed burgers
    console.log('Seeding burgers...');
    const client = await clientPromise;
    const db = client.db();
    
    // Clear existing burgers
    await db.collection('burgers').deleteMany({});
    console.log('Cleared existing burgers');

    // Insert new burgers
    const result = await db.collection('burgers').insertMany(burgers);
    console.log('Inserted burgers:', result.insertedCount);

    console.log('Database seeding completed successfully');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error: 'Failed to seed database' };
  }
} 