import clientPromise from '@/features/database/config/mongodb';

export async function getNextOrderNumber(): Promise<number> {
  const client = await clientPromise;
  const db = client.db('saborea');
  const counters = db.collection('counters');

  const result = await counters.findOneAndUpdate(
    { _id: 'orderNumber' },
    { $inc: { sequence_value: 1 } },
    { upsert: true, returnDocument: 'after' }
  );

  return result?.sequence_value || 1;
}

