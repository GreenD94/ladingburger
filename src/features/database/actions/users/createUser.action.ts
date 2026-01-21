'use server';

import { connectToDatabase } from '../../actions/connect.action';
import { assignNuevoOnUserCreation } from '@/features/etiquetas/utils/userTags.util';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export async function createUser(
  phoneNumber: string,
  name: string,
  birthdate: Date,
  gender: string,
  notes: string
) {
  try {
    const { db } = await connectToDatabase();
    
    const existingUser = await db.collection('users').findOne({ phoneNumber });
    if (existingUser) {
      return {
        success: false,
        error: 'Phone number already exists'
      };
    }

    const newUser = {
      phoneNumber,
      name: name.trim() !== EMPTY_STRING ? name.trim() : undefined,
      birthdate: birthdate && !isNaN(birthdate.getTime()) ? birthdate : undefined,
      gender: gender.trim() !== EMPTY_STRING ? gender.trim() : undefined,
      notes: notes.trim() !== EMPTY_STRING ? notes.trim() : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    const userId = result.insertedId.toString();

    // Assign "Nuevo" etiqueta to newly created user
    try {
      await assignNuevoOnUserCreation(userId);
    } catch (etiquetaError) {
      console.error('Error assigning Nuevo etiqueta to user:', etiquetaError);
      // Don't fail user creation if etiqueta assignment fails
    }
    
    return {
      success: true,
      userId
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: 'Failed to create user'
    };
  }
}

