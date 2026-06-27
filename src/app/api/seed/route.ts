import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/features/database/actions/connect.action';
import bcrypt from 'bcryptjs';
import { BURGER_IMAGES } from '@/features/database/types/burger.type';
import { generateEtiquetaId, generateEtiquetaRef } from '@/features/database/types/etiqueta.type';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'admin@saborea.com';
const ADMIN_PASSWORD = 'admin123';

const BURGERS = [
  {
    name: 'Hamburguesa Clásica',
    description: 'Carne blend 150g (80% solomo 20% cerdo), lechuga, tomate, queso americano, tocineta, pan brioche y 120g de papas.',
    price: 5,
    image: BURGER_IMAGES.CLASSIC,
    category: 'clásica',
    ingredients: ['Carne blend 150g', 'Lechuga', 'Tomate', 'Queso americano', 'Tocineta', 'Pan brioche', 'Papas 120g'],
    isAvailable: true,
  },
  {
    name: 'Hamburguesa Crispy',
    description: '140g de pollo Crispy, lechuga, tomate, queso cheddar, tocineta, pan brioche y 120g de papas.',
    price: 5,
    image: BURGER_IMAGES.CLASSIC,
    category: 'especialidad',
    ingredients: ['Pollo Crispy 140g', 'Lechuga', 'Tomate', 'Queso cheddar', 'Tocineta', 'Pan brioche', 'Papas 120g'],
    isAvailable: true,
  },
  {
    name: 'Hamburguesa con Queso',
    description: '120g de carne blend x2, tocineta, queso americano, queso cheddar, pepinillos, salsa BBQ de la casa, pan brioche y 120g de papas.',
    price: 7,
    image: BURGER_IMAGES.DOUBLE_CHEESE,
    category: 'queso',
    ingredients: ['Carne blend 120g x2', 'Tocineta', 'Queso americano', 'Queso cheddar', 'Pepinillos', 'Salsa BBQ', 'Pan brioche', 'Papas 120g'],
    isAvailable: true,
  },
  {
    name: "MaxiSabor'S",
    description: '140g de pollo crispy, 150g de carne blend, tocineta, salsa BBQ de la casa, lechuga, tomate y 120g de papas.',
    price: 8,
    image: BURGER_IMAGES.DOUBLE_CHEESE,
    category: 'especialidad',
    ingredients: ['Pollo crispy 140g', 'Carne blend 150g', 'Tocineta', 'Salsa BBQ', 'Lechuga', 'Tomate', 'Papas 120g'],
    isAvailable: true,
  },
];

const ETIQUETAS = [
  // Automatic (system-managed)
  { name: 'Nuevo', color: '#10B981', isSystemManaged: true },
  { name: 'Pago Fallido', color: '#EF4444', isSystemManaged: true },
  { name: 'Cancelaciones Frecuentes', color: '#EAB308', isSystemManaged: true },
  { name: 'Problemas de Entrega', color: '#EF4444', isSystemManaged: true },
  { name: 'Reembolsos', color: '#EAB308', isSystemManaged: true },
  { name: 'Cliente Activo', color: '#10B981', isSystemManaged: true },
  { name: 'En Riesgo', color: '#EAB308', isSystemManaged: true },
  { name: 'Primer Pedido', color: '#10B981', isSystemManaged: true },
  // Manual
  { name: 'VIP', color: '#8B5CF6', isSystemManaged: false },
  { name: 'Peligroso / Problemático', color: '#EF4444', isSystemManaged: false },
  { name: 'Restricciones Alimentarias', color: '#06B6D4', isSystemManaged: false },
  { name: 'Dirección Especial', color: '#06B6D4', isSystemManaged: false },
  { name: 'Horario Restringido', color: '#06B6D4', isSystemManaged: false },
  { name: 'Empleado', color: '#8B5CF6', isSystemManaged: false },
  { name: 'Amigo / Familiar', color: '#8B5CF6', isSystemManaged: false },
  { name: 'Cliente Corporativo', color: '#8B5CF6', isSystemManaged: false },
  { name: 'Influencer / Referidor', color: '#10B981', isSystemManaged: false },
  { name: 'Descuento Activo', color: '#10B981', isSystemManaged: false },
  { name: 'No Contactar', color: '#EF4444', isSystemManaged: false },
  { name: 'Verificación Pendiente', color: '#EAB308', isSystemManaged: false },
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const now = new Date();
    const results: Record<string, string> = {};

    // ── Admin ──────────────────────────────────────────────────────────────
    const existing = await db.collection('admins').findOne({ email: ADMIN_EMAIL });
    if (!existing) {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await db.collection('admins').insertOne({
        email: ADMIN_EMAIL,
        password: hashed,
        isEnabled: true,
        createdAt: now,
        updatedAt: now,
      });
      results.admin = `created: ${ADMIN_EMAIL}`;
    } else {
      results.admin = `already exists: ${ADMIN_EMAIL}`;
    }

    // ── Burgers ────────────────────────────────────────────────────────────
    const burgerCount = await db.collection('burgers').countDocuments();
    if (burgerCount === 0) {
      await db.collection('burgers').insertMany(
        BURGERS.map((b) => ({ ...b, createdAt: now, updatedAt: now }))
      );
      results.burgers = `seeded ${BURGERS.length} burgers`;
    } else {
      results.burgers = `skipped (${burgerCount} already exist)`;
    }

    // ── Etiquetas ──────────────────────────────────────────────────────────
    const etiquetaCount = await db.collection('etiquetas').countDocuments();
    if (etiquetaCount === 0) {
      await db.collection('etiquetas').insertMany(
        ETIQUETAS.map((e) => ({
          id: generateEtiquetaId(),
          ref: generateEtiquetaRef(e.name),
          name: e.name,
          color: e.color,
          isEnabled: true,
          isSystemManaged: e.isSystemManaged,
          isSystemCreated: true,
          createdAt: now,
          updatedAt: now,
        }))
      );
      results.etiquetas = `seeded ${ETIQUETAS.length} etiquetas`;
    } else {
      results.etiquetas = `skipped (${etiquetaCount} already exist)`;
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Seed failed' },
      { status: 500 }
    );
  }
}
