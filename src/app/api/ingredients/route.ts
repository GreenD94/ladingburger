import { getIngredients } from '@/features/database/actions/ingredients/getIngredients';
import { createIngredient } from '@/features/database/actions/ingredients/createIngredient';
import { updateIngredient } from '@/features/database/actions/ingredients/updateIngredient';
import { deleteIngredient } from '@/features/database/actions/ingredients/deleteIngredient';
import { NextResponse } from 'next/server';

export async function GET() {
  const ingredients = await getIngredients();
  return NextResponse.json(ingredients);
}

export async function POST(request: Request) {
  const data = await request.json();
  const result = await createIngredient(data);
  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...update } = data;
  const result = await updateIngredient(id, update);
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const result = await deleteIngredient(id);
  return NextResponse.json(result);
} 