import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '../config/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function login(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const admin = await db.collection('admins').findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: admin._id.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      admin: {
        id: admin._id.toString(),
        email: admin.email
      }
    });

    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function logout() {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.delete('adminToken');
  return response;
}

export async function getCurrentAdmin(req: NextRequest) {
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
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...admin,
      _id: admin._id.toString()
    });
  } catch (error: unknown) {
    console.error('Get current admin error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
} 