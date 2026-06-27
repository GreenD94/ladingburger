import clientPromise from '@/features/database/config/mongodb';
import { Collection } from 'mongodb';

interface CounterDocument {
  _id: string;
  sequence_value: number;
}

export async function getNextOrderNumber(): Promise<number> {
  const client = await clientPromise;
  const db = client.db('saborea');
  const counters = db.collection('counters') as unknown as Collection<CounterDocument>;

  const result = await counters.findOneAndUpdate(
    { _id: 'orderNumber' },
    { $inc: { sequence_value: 1 } },
    { upsert: true, returnDocument: 'after' }
  );

  return result?.sequence_value || 1;
}

