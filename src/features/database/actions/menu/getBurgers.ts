'use server';

import clientPromise from '../../config/mongodb';
import { Burger } from '../../types/index';

export async function getBurgers() {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    
    const burgers = await db
      .collection<Burger>('burgers')
      .find({ isAvailable: true })
      .toArray();

    return {
      success: true,
      burgers: burgers.map(burger => ({
        ...burger,
        _id: burger._id?.toString(),
      })),
    };
  } catch (error) {
    console.error('Error fetching burgers:', error);
    return {
      success: false,
      error: 'Failed to fetch burgers',
    };
  }
} 