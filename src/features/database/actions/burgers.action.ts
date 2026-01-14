'use server';

import { connectToDatabase } from './connect.action';
import { Burger } from '../types/index.type';
import { WithId, Document } from 'mongodb';
import { EMPTY_BURGER } from '../constants/emptyObjects.constants';

export async function getBurgers(): Promise<Burger[]> {
  try {
    const { db } = await connectToDatabase();
    const burgers = await db.collection('burgers').find({}).toArray();
    
    return burgers.map((doc: WithId<Document>) => ({
      ...doc,
      _id: doc._id.toString()
    })) as Burger[];
  } catch (error) {
    console.error('Error getting burgers:', error);
    return [];
  }
}

