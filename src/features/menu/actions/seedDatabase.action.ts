'use server';

import { createAdmin } from '@/features/database/models/admin.model';
import clientPromise from '@/features/database/config/mongodb';
import { Burger } from '@/features/database/types/index.type';
import { BURGER_IMAGES } from '@/features/database/types/burger.type';

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
    isAvailable: true,
  },
];

export async function seedDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');

    const existingBurgers = await db.collection('burgers').countDocuments();
    if (existingBurgers > 0) {
      return {
        success: false,
        message: 'Database already has burgers',
        error: 'Database already seeded'
      };
    }

    await db.collection('burgers').insertMany(burgers);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    try {
      await createAdmin({ email: adminEmail, password: adminPassword });
    } catch (error) {
      console.error('Error creating admin:', error);
    }

    return {
      success: true,
      message: 'Database seeded successfully'
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

