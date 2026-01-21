'use server'

import clientPromise from '../../config/mongodb';
import { User } from '../../types/index.type';
import { assignNuevoOnUserCreation } from '@/features/etiquetas/utils/userTags.util';

export async function getOrCreateUser(phoneNumber: string): Promise<{ userId: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    const users = db.collection<User>('users');

    const existingUser = await users.findOne({ phoneNumber });
    if (existingUser && existingUser._id) {
      return { userId: existingUser._id.toString() };
    }

    const newUser = {
      phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    const userId = result.insertedId.toString();

    // Assign "Nuevo" etiqueta to newly created user
    try {
      await assignNuevoOnUserCreation(userId);
    } catch (etiquetaError) {
      console.error('Error assigning Nuevo etiqueta to user:', etiquetaError);
      // Don't fail user creation if etiqueta assignment fails
    }

    return { userId };
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Failed to get or create user');
  }
}

