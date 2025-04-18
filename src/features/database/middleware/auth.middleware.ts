import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '../config/mongodb';
import { ObjectId } from 'mongodb';

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
    
    const client = await clientPromise;
    const db = client.db();
    const admin = await db.collection('admins').findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } }
    );

    if (!admin) {
      return NextResponse.json(
        { message: 'Admin not found' },
        { status: 401 }
      );
    }

    // Add admin to request headers for downstream use
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-admin-id', admin._id.toString());
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