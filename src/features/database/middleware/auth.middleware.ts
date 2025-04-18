import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/admin.model';
import { Admin } from '../types/admin';

export async function authMiddleware(req: NextRequest) {
  try {
    const token = req.cookies.get('adminToken')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
    const admin = await AdminModel.findById(decoded.id).select('-password') as (Admin & { _id: string }) | null;

    if (!admin) {
      return NextResponse.json(
        { message: 'Admin not found' },
        { status: 401 }
      );
    }

    // Add admin to request headers for downstream use
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-admin-id', admin._id);
    requestHeaders.set('x-admin-email', admin.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error: unknown) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
} 