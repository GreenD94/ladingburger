import { connectToDatabase } from '../../actions/connect';
import { Ingredient } from '../../types/ingredients';
import { ObjectId } from 'mongodb';

export async function updateIngredient(id: string, update: Partial<Omit<Ingredient, '_id'>>) {
  const { db } = await connectToDatabase();
  const result = await db.collection<Ingredient>('ingredients').updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  );
  return { success: result.modifiedCount > 0 };
} 