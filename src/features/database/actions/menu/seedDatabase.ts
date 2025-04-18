'use server';

import clientPromise from '../../config/mongodb';
import { Burger, BusinessContact, Admin } from '../../types/index';
import bcrypt from 'bcryptjs';

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

const businessContact: Omit<BusinessContact, '_id'> = {
  whatsappLink: 'https://wa.me/584125188174',
  instagramLink: 'https://www.instagram.com/jesusg_sanchez/',
  venezuelaPayment: {
    phoneNumber: '584242424242',
    bankAccount: '0102-1234-5678-9012',
    documentNumber: 'V-12345678'
  },
  qrCodeUrl: '/qr-code.png',
  dolarRate: 35.5,
  dolarRateUpdatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const admin: Omit<Admin, '_id'> = {
  email: 'admin@admin.com',
  password: bcrypt.hashSync('12345', 10),
  createdAt: new Date(),
  updatedAt: new Date()
};

export async function seedDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    
    // Clear existing data
    await db.collection('burgers').deleteMany({});
    await db.collection('businessContacts').deleteMany({});
    await db.collection('admins').deleteMany({});

    // Insert new data
    const burgersResult = await db.collection<Burger>('burgers').insertMany(initialBurgers);
    await db.collection<Omit<BusinessContact, '_id'>>('businessContacts').insertOne(businessContact);
    await db.collection<Omit<Admin, '_id'>>('admins').insertOne(admin);

    return {
      success: true,
      message: `Base de datos sembrada exitosamente con ${burgersResult.insertedCount} hamburguesas y un administrador`,
    };
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error);
    return {
      success: false,
      error: 'Error al sembrar la base de datos',
    };
  }
} 