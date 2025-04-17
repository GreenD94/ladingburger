'use server';

import { connectToDatabase } from '../../actions/connect';

export async function createUser(phoneNumber: string) {
  try {
    const { db } = await connectToDatabase();
    
    // Check if phone number already exists
    const existingUser = await db.collection('users').findOne({ phoneNumber });
    if (existingUser) {
      return {
        success: false,
        error: 'Phone number already exists'
      };
    }

    const newUser = {
      phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    
    return {
      success: true,
      userId: result.insertedId.toString()
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: 'Failed to create user'
    };
  }
} 