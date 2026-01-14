import { connectToDatabase } from '@/features/database/connection';
import { Order, OrderStatus } from '@/features/database/types/index.type';

interface MongoOrderDocument {
  _id: { toString(): string };
  createdAt: { toISOString(): string };
  updatedAt: { toISOString(): string };
  items: Array<{
    burgerId: { toString(): string };
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

function convertToPlainObject(doc: MongoOrderDocument): Order {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: new Date(doc.createdAt.toISOString()),
    updatedAt: new Date(doc.updatedAt.toISOString()),
    items: doc.items.map((item) => ({
      ...item,
      burgerId: item.burgerId.toString()
    })) as Order['items']
  } as Order;
}

export async function getOrders() {
  const db = await connectToDatabase();
  const orders = db.collection('orders');

  const allOrders = await orders.find().toArray();
  
  const plainOrders = allOrders.map((doc) => convertToPlainObject(doc as unknown as MongoOrderDocument));

  const ordersByStatus = Object.values(OrderStatus).reduce((acc, status) => {
    acc[status] = plainOrders.filter((order: Order) => order.status === status);
    return acc;
  }, {} as Record<typeof OrderStatus[keyof typeof OrderStatus], Order[]>);

  return ordersByStatus;
}

