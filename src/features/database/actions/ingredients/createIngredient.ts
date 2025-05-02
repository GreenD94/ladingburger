import { connectToDatabase } from '../../actions/connect';
import { Ingredient } from '../../types/ingredients';

export async function createIngredient(ingredient: Omit<Ingredient, '_id'>) {
  const { db } = await connectToDatabase();
  const result = await db.collection<Ingredient>('ingredients').insertOne(ingredient);
  return { success: true, insertedId: result.insertedId };
} 