import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/client/auth/error?error=${encodeURIComponent('Missing token')}`);
  }

  try {
    const email = await verifyToken(token);
    
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/client/dashboard`);
    response.cookies.set('auth_token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    });

    return response;
  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/client/auth/error?error=${encodeURIComponent(error.message || 'Invalid or expired token')}`);
  }
}