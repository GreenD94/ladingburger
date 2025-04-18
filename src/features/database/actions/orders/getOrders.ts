import { connectToDatabase } from '@/features/database/connection';
import { Order, OrderStatus } from '@/features/database/types';

function convertToPlainObject(doc: any) {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    items: doc.items.map((item: any) => ({
      ...item,
      burgerId: item.burgerId.toString()
    }))
  };
}

export async function getOrders() {
  const db = await connectToDatabase();
  const orders = db.collection('orders');

  const allOrders = await orders.find().toArray();
  
  // Convert MongoDB documents to plain objects
  const plainOrders = allOrders.map(convertToPlainObject);

  // Group orders by status
  const ordersByStatus = Object.values(OrderStatus).reduce((acc, status) => {
    acc[status] = plainOrders.filter((order: Order) => order.status === status);
    return acc;
  }, {} as Record<typeof OrderStatus[keyof typeof OrderStatus], Order[]>);

  return ordersByStatus;
} 