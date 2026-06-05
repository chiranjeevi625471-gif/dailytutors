import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcryptjs from 'bcryptjs';
import { errorResponse, successResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, confirmPassword } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        errorResponse('Missing required fields'),
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        errorResponse('Passwords do not match'),
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        errorResponse('Password must be at least 6 characters'),
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        errorResponse('User already exists with this email'),
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'student',
      verified: false,
    });

    return NextResponse.json(
      successResponse('User registered successfully', {
        userId: user._id,
        email: user.email,
        name: user.name,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      errorResponse('Registration failed', error.message),
      { status: 500 }
    );
  }
}
