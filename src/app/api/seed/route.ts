import { NextResponse } from 'next/server';
import { seedDatabase } from '@/features/database/actions/menu';

export async function GET() {
  try {
    const result = await seedDatabase();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to seed database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'Database seeded successfully'
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to seed database' 
      },
      { status: 500 }
    );
  }
}

