'use server';

import { createAdmin } from '../../models/admin.model';
import clientPromise from '../../config/mongodb';
import { Burger, BURGER_IMAGES } from '../../types/burger';

const burgers: Omit<Burger, '_id'>[] = [
  {
    name: 'Classic Burger',
    description: 'Our signature beef patty with lettuce, tomato, and special sauce',
    price: 8.99,
    image: BURGER_IMAGES.CLASSIC,
    category: 'classic',
    ingredients: ['Beef patty', 'Lettuce', 'Tomato', 'Special sauce', 'Bun'],
    isAvailable: true
  },
  {
    name: 'Cheeseburger',
    description: 'Classic burger with melted cheddar cheese',
    price: 9.99,
    image: BURGER_IMAGES.DOUBLE_CHEESE,
    category: 'cheese',
    ingredients: ['Beef patty', 'Cheddar cheese', 'Lettuce', 'Tomato', 'Special sauce', 'Bun'],
    isAvailable: true
  },
  {
    name: 'Bacon Burger',
    description: 'Classic burger with crispy bacon strips',
    price: 10.99,
    image: BURGER_IMAGES.DOUBLE_CHEESE,
    category: 'bacon',
    ingredients: ['Beef patty', 'Bacon', 'Lettuce', 'Tomato', 'Special sauce', 'Bun'],
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