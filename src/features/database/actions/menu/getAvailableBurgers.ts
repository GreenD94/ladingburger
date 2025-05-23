'use server';

import { connectToDatabase } from '../../actions/connect';
import { Burger } from '../../types';
import { WithId, Document } from 'mongodb';

export async function getAvailableBurgers() {
  try {
    const { db } = await connectToDatabase();
    const burgers = await db.collection('burgers').find({ isAvailable: true }).toArray();
    
    return burgers.map((doc: WithId<Document>) => ({
      ...doc,
      _id: doc._id.toString()
    })) as Burger[];
  } catch (error) {
    console.error('Error getting burgers:', error);
    return null;
  }
} 