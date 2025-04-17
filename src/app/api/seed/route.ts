import { NextResponse } from 'next/server';
import { seedDatabase } from '@/features/database/seed';

export async function POST() {
  try {
    const result = await seedDatabase();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully seeded ${result.insertedCount} burgers`
    });
  } catch (error) {
    console.error('Error in seed API:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
} 