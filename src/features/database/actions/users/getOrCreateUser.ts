'use server'

import clientPromise from '../../config/mongodb';
import { User } from '../../types';

export async function getOrCreateUser(phoneNumber: string): Promise<{ userId: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    const users = db.collection<User>('users');

    // Try to find existing user
    const existingUser = await users.findOne({ phoneNumber });
    if (existingUser) {
      return { userId: existingUser._id!.toString() };
    }

    // Create new user if not found
    const newUser = {
      phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    return { userId: result.insertedId.toString() };
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Failed to get or create user');
  }
} 