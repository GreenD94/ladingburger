'use server';

import { connectToDatabase } from '../../actions/connect';
import { Burger, BURGER_IMAGES, BurgerImage } from '../../types/burger';
import { WithId, Document } from 'mongodb';

export async function getAvailableBurgers() {
  try {
    const { db } = await connectToDatabase();
    const burgers = await db.collection('burgers').find({ isAvailable: true }).toArray();
    
    return burgers.map((doc: WithId<Document>) => ({
      ...doc,
      _id: doc._id.toString(),
      image: (Object.values(BURGER_IMAGES) as string[]).includes(doc.image)
        ? doc.image as BurgerImage
        : BURGER_IMAGES.CLASSIC // fallback o puedes dejar doc.image
    })) as Burger[];
  } catch (error) {
    console.error('Error getting burgers:', error);
    return null;
  }
} 