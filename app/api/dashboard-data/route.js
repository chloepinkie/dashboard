import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    await verifyToken(token);
    
    // TODO: Fetch your SQL data here
    const dashboardData = {
      // Example data
      salesData: [/* ... */],
      userStats: {/* ... */},
      // Add more data as needed
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}