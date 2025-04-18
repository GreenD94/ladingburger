import { MenuItemWithId } from '@/features/database/types/menu';
import clientPromise from '../config/mongodb';
import { Db, WithId, ObjectId } from 'mongodb';
import { aggregateSalesData, aggregateCustomerData, determineTimeRange } from '@/features/analytics/utils/dataAggregation';

export interface Order {
  _id: string;
  customerId: string;
  customerPhone: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: Date;
}

export interface OrderItem {
  burgerId: string;
  quantity: number;
  price: number;
}

export interface DailySales {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
  itemsSold: {
    burgerId: string;
    quantity: number;
    revenue: number;
  }[];
  peakHours: {
    hour: number;
    orders: number;
  }[];
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface CustomerData {
  date: string;
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export interface TopSellingItem {
  burgerId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageOrderFrequency: number;
  averageOrderValue: number;
}

export interface MenuAnalytics {
  totalItems: number;
  topSellingItems: TopSellingItem[];
  averagePrice: number;
}

export interface AnalyticsSummary {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  topSellingItems: TopSellingItem[];
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    averageOrderFrequency: number;
  };
}

export async function updateDailySales(date: Date) {
  const client = await clientPromise;
  const db = client.db('saborea');

  // Get all orders for the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const orders = await db.collection('orders').find({
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  }).toArray() as unknown as Order[];

  // Calculate daily metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate customer metrics
  const customerOrders = orders.reduce((acc, order) => {
    if (!acc[order.customerPhone]) {
      acc[order.customerPhone] = 1;
    } else {
      acc[order.customerPhone]++;
    }
    return acc;
  }, {} as Record<string, number>);

  const newCustomers = Object.keys(customerOrders).length;
  const returningCustomers = Object.values(customerOrders).filter(count => count > 1).length;
  const totalCustomers = newCustomers + returningCustomers;

  // Calculate items sold
  const itemsSold = orders.reduce((acc, order) => {
    order.items.forEach((item: OrderItem) => {
      const existing = acc.find(i => i.burgerId === item.burgerId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.quantity * (order.totalPrice / order.items.length);
      } else {
        acc.push({
          burgerId: item.burgerId,
          quantity: item.quantity,
          revenue: item.quantity * (order.totalPrice / order.items.length)
        });
      }
    });
    return acc;
  }, [] as { burgerId: string; quantity: number; revenue: number }[]);

  // Calculate peak hours
  const peakHours = Array(24).fill(0).map((_, hour) => {
    const hourStart = new Date(date);
    hourStart.setHours(hour, 0, 0, 0);
    const hourEnd = new Date(date);
    hourEnd.setHours(hour, 59, 59, 999);

    const hourOrders = orders.filter(order => 
      order.createdAt >= hourStart && order.createdAt <= hourEnd
    ).length;

    return { hour, orders: hourOrders };
  });

  const dailySales: DailySales = {
    date: date.toISOString().split('T')[0],
    totalRevenue,
    totalOrders,
    averageOrderValue,
    newCustomers,
    returningCustomers,
    totalCustomers,
    itemsSold,
    peakHours
  };

  // Update or insert daily sales
  await db.collection('daily_sales').updateOne(
    { date: { $eq: date.toISOString().split('T')[0] } },
    { $set: dailySales },
    { upsert: true }
  );

  return dailySales;
}

export async function getAnalyticsSummary(db: Db, days: number): Promise<AnalyticsSummary> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await db.collection('orders').find({
    createdAt: { $gte: startDate, $lte: endDate }
  }).toArray() as unknown as Order[];

  // Calculate revenue metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate customer metrics
  const customerOrders = orders.reduce((acc, order) => {
    if (!acc[order.customerPhone]) {
      acc[order.customerPhone] = 1;
    } else {
      acc[order.customerPhone]++;
    }
    return acc;
  }, {} as Record<string, number>);

  const newCustomers = Object.keys(customerOrders).length;
  const returningCustomers = Object.values(customerOrders).filter(count => count > 1).length;
  const totalCustomers = newCustomers + returningCustomers;

  // Get top selling items
  const topSellingItems = await getTopSellingItems(db, days);

  return {
    period: determineTimeRange(days),
    startDate,
    endDate,
    totalRevenue,
    totalOrders,
    averageOrderValue,
    totalCustomers,
    newCustomers,
    returningCustomers,
    topSellingItems,
    customerMetrics: {
      newCustomers,
      returningCustomers,
      averageOrderFrequency: newCustomers > 0 ? totalOrders / newCustomers : 0
    }
  };
}

export async function getPeakHours(db: Db, date: Date) {
  try {
    const dateString = date.toISOString().split('T')[0];
    const dailySales = await db.collection<DailySales>('daily_sales')
      .findOne({ date: { $eq: dateString } });

    if (dailySales?.peakHours) {
      return dailySales.peakHours;
    }

    // If not, calculate from orders
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await db.collection('orders')
      .find({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      })
      .toArray();

    // Calculate orders per hour
    const hourlyOrders = new Array(24).fill(0);
    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourlyOrders[hour]++;
    });

    // Transform to required format
    const peakHours = hourlyOrders.map((orders, hour) => ({
      hour,
      orders
    }));

    // Cache the results
    await db.collection<DailySales>('daily_sales')
      .updateOne(
        { date: { $eq: dateString } },
        { $set: { peakHours } },
        { upsert: true }
      );

    return peakHours;
  } catch (error) {
    console.error('Error getting peak hours:', error);
    throw error;
  }
}

export async function getSalesData(db: Db, days: number) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await db.collection('orders').find({
    createdAt: { $gte: startDate, $lte: endDate }
  }).toArray() as unknown as Order[];

  // Group orders by date
  const salesByDate = orders.reduce((acc, order) => {
    const date = order.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        revenue: 0,
        orders: 0
      };
    }
    acc[date].revenue += order.totalPrice;
    acc[date].orders += 1;
    return acc;
  }, {} as Record<string, { revenue: number; orders: number }>);

  // Convert to array and sort by date
  const salesData = Object.entries(salesByDate).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.orders
  })).sort((a, b) => a.date.localeCompare(b.date));

  return salesData;
}

export async function getTopSellingItems(db: Db, days: number) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await db.collection('orders').find({
    createdAt: { $gte: startDate, $lte: endDate }
  }).toArray() as unknown as Order[];

  // Get all menu items to map IDs to names
  const menuItems = await db.collection('menu_items').find({}).toArray() as unknown as MenuItemWithId[];
  const menuItemMap = new Map(menuItems.map(item => [item._id.toString(), item]));

  // Aggregate item sales
  const itemSales = new Map<string, { quantity: number; revenue: number }>();

  orders.forEach(order => {
    order.items.forEach(item => {
      const itemId = item.burgerId.toString();
      const current = itemSales.get(itemId) || { quantity: 0, revenue: 0 };
      const menuItem = menuItemMap.get(itemId);
      
      if (!menuItem) {
        console.warn(`Menu item not found for ID: ${itemId}`);
        return; // Skip items that don't exist in the menu
      }
      
      itemSales.set(itemId, {
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + (menuItem.price * item.quantity)
      });
    });
  });

  // Convert to array and sort by quantity
  const topSellingItems: TopSellingItem[] = Array.from(itemSales.entries())
    .map(([itemId, data]) => {
      const menuItem = menuItemMap.get(itemId);
      if (!menuItem) {
        console.warn(`Menu item not found for ID: ${itemId} during final mapping`);
        return null;
      }
      return {
        burgerId: itemId,
        name: menuItem.name,
        quantity: data.quantity,
        revenue: data.revenue
      };
    })
    .filter((item): item is TopSellingItem => item !== null)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10); // Get top 10 items

  return topSellingItems;
}

export async function getCustomerAnalytics(db: Db, days: number): Promise<CustomerAnalytics> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await db.collection('orders').find({
    createdAt: { $gte: startDate, $lte: endDate }
  }).toArray() as unknown as Order[];

  // Calculate customer metrics
  const customerOrders = orders.reduce((acc, order) => {
    if (!acc[order.customerPhone]) {
      acc[order.customerPhone] = 1;
    } else {
      acc[order.customerPhone]++;
    }
    return acc;
  }, {} as Record<string, number>);

  const newCustomers = Object.keys(customerOrders).length;
  const returningCustomers = Object.values(customerOrders).filter(count => count > 1).length;
  const totalCustomers = newCustomers + returningCustomers;
  const averageOrderFrequency = newCustomers > 0 ? orders.length / newCustomers : 0;
  const averageOrderValue = orders.length > 0 
    ? orders.reduce((sum, order) => sum + order.totalPrice, 0) / orders.length 
    : 0;

  return {
    totalCustomers,
    newCustomers,
    returningCustomers,
    averageOrderFrequency,
    averageOrderValue
  };
} 