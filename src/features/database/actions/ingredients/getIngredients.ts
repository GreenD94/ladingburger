import { connectToDatabase } from '../../actions/connect';
import { Ingredient } from '../../types/ingredients';

export async function getIngredients(): Promise<Ingredient[]> {
  const { db } = await connectToDatabase();
  return db.collection<Ingredient>('ingredients').find({}).toArray();
} 