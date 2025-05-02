import { connectToDatabase } from '../../actions/connect';
import { ObjectId } from 'mongodb';

export async function deleteIngredient(id: string) {
  const { db } = await connectToDatabase();
  const result = await db.collection('ingredients').deleteOne({ _id: new ObjectId(id) });
  return { success: result.deletedCount > 0 };
} 