import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful! ✅',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: 'Check your MONGODB_URI in .env.local',
    }, { status: 500 });
  }
}
