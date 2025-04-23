import { getAvailableBurgers } from '@/features/database/actions/menu';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const burgers = await getAvailableBurgers();
    return NextResponse.json(burgers || []);
  } catch (error) {
    console.error('Error fetching burgers:', error);
    return NextResponse.json({ error: 'Failed to fetch burgers' }, { status: 500 });
  }
} 