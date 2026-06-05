import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcryptjs from 'bcryptjs';
import { generateJWT, errorResponse, successResponse } from '@/lib/api-utils';
import { ADMIN_COOKIE, getAdminPassword, getAdminToken } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, isAdmin } = await request.json();

    // Admin login
    if (isAdmin) {
      if (password !== getAdminPassword()) {
        return NextResponse.json(
          errorResponse('Invalid admin password'),
          { status: 401 }
        );
      }

      const res = NextResponse.json(
        successResponse('Admin login successful')
      );
      res.cookies.set(ADMIN_COOKIE, getAdminToken(), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    // Student login
    if (!email || !password) {
      return NextResponse.json(
        errorResponse('Email and password are required'),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return NextResponse.json(
        errorResponse('Invalid email or password'),
        { status: 401 }
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        errorResponse('Invalid email or password'),
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Update last active
    user.stats.lastActive = new Date();
    await user.save();

    return NextResponse.json(
      successResponse('Login successful', {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        },
      })
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      errorResponse('Login failed', error.message),
      { status: 500 }
    );
  }
}
