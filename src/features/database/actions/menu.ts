'use server';

import { getBurgers } from './menu/getBurgers';
import { seedDatabase as seedDatabaseAction } from './menu/seedDatabase';
import { connectToDatabase } from '../actions/connect';
import { Burger } from '../types';
import { ObjectId } from 'mongodb';

export async function getAvailableBurgers() {
  const result = await getBurgers();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch available burgers');
  }
  return result.burgers;
}

export async function seedDatabase(): Promise<{ success: boolean; message: string; error?: string }> {
  const result = await seedDatabaseAction();
  if (!result.success) {
    throw new Error(result.error || 'Failed to seed database');
  }
  return {
    success: true,
    message: result.message || 'Database seeded successfully'
  };
}

export async function createBurger(burger: Omit<Burger, '_id'>) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('burgers').insertOne(burger);
    return {
      success: true,
      burgerId: result.insertedId.toString()
    };
  } catch (error) {
    console.error('Error creating burger:', error);
    return {
      success: false,
      error: 'Failed to create burger'
    };
  }
}

export async function updateBurger(burgerId: string, burger: Partial<Omit<Burger, '_id'>>) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('burgers').updateOne(
      { _id: new ObjectId(burgerId) },
      { $set: burger }
    );
    
    if (result.matchedCount === 0) {
      return {
        success: false,
        error: 'Burger not found'
      };
    }

    return {
      success: true,
      message: 'Burger updated successfully'
    };
  } catch (error) {
    console.error('Error updating burger:', error);
    return {
      success: false,
      error: 'Failed to update burger'
    };
  }
}

export async function deleteBurger(burgerId: string) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('burgers').deleteOne({ _id: new ObjectId(burgerId) });
    
    if (result.deletedCount === 0) {
      return {
        success: false,
        error: 'Burger not found'
      };
    }

    return {
      success: true,
      message: 'Burger deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting burger:', error);
    return {
      success: false,
      error: 'Failed to delete burger'
    };
  }
} 