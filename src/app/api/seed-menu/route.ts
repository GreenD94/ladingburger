import { NextResponse } from 'next/server';
import { seedMenuItems } from '@/features/database/actions/menu/seedMenuItems';

export async function GET() {
  try {
    const result = await seedMenuItems();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to seed menu items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'Menu items seeded successfully'
    });
  } catch (error) {
    console.error('Error seeding menu items:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to seed menu items' 
      },
      { status: 500 }
    );
  }
}

