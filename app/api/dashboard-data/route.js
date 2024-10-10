import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const email = await verifyToken(token);

    if (!email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get date range from query parameters
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const client = await clientPromise;
    const db = client.db();
    const csvCollection = db.collection('csvData');

    // Fetch the most recent CSV data
    const csvData = await csvCollection.findOne({}, { sort: { uploadedAt: -1 } });

    if (!csvData) {
      return NextResponse.json({ error: 'No CSV data found' }, { status: 404 });
    }

    // Process the CSV data to calculate the required metrics
    const processedData = processCSVData(csvData.data, startDate, endDate);

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'An error occurred while fetching dashboard data' }, { status: 500 });
  }
}

function processCSVData(data, startDate, endDate) {
  // Convert start and end dates to Date objects
  const start = startDate ? new Date(startDate) : new Date(0);
  const end = endDate ? new Date(endDate) : new Date();

  // Initialize variables for calculations
  let totalRevenue = 0;
  let totalOrders = 0;
  let totalAffiliates = new Set();
  let affiliatesCreatingSales = new Set();
  let totalClicks = 0;
  let totalMentions = 0;
  let totalEMV = 0;
  let totalCommission = 0;

  // Create daily aggregates for time series data
  const dailyData = {};

  // Process each row of the CSV data
  data.forEach(row => {
    const rowDate = new Date(row['First Linked']);
    if (rowDate >= start && rowDate <= end) {
      const date = row['First Linked'];
      const revenue = parseFloat(row['Order Volume'] || 0);
      const orders = parseInt(row['Order Count'] || 0);
      const clicks = parseInt(row['Clicks'] || 0);
      const mentions = parseInt(row['Mentions'] || 0);
      const emv = parseFloat(row['Estimated Media Value'] || 0);
      const commission = parseFloat(row['Commissions Earned'] || 0);

      totalRevenue += revenue;
      totalOrders += orders;
      totalAffiliates.add(row['Username']);
      if (orders > 0) affiliatesCreatingSales.add(row['Username']);
      totalClicks += clicks;
      totalMentions += mentions;
      totalEMV += emv;
      totalCommission += commission;

      // Aggregate daily data
      if (!dailyData[date]) {
        dailyData[date] = { date, revenue: 0, orders: 0, clicks: 0, mentions: 0, emv: 0, commission: 0 };
      }
      dailyData[date].revenue += revenue;
      dailyData[date].orders += orders;
      dailyData[date].clicks += clicks;
      dailyData[date].mentions += mentions;
      dailyData[date].emv += emv;
      dailyData[date].commission += commission;
    }
  });

  const totalAffiliatesCount = totalAffiliates.size;
  const affiliatesCreatingSalesCount = affiliatesCreatingSales.size;

  // Convert daily data to array and sort by date
  const timeSeriesData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    salesData: timeSeriesData,
    affiliateData: timeSeriesData,
    costData: timeSeriesData,
    sales: {
      revenue: totalRevenue,
      ordersGenerated: totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    },
    affiliate: {
      totalAffiliates: totalAffiliatesCount,
      newAffiliates: totalAffiliatesCount, // This is now total affiliates, as we can't determine new ones from this data
      affiliatesCreatingSales: affiliatesCreatingSalesCount,
      percentAffiliatesCreatingSales: totalAffiliatesCount > 0 ? (affiliatesCreatingSalesCount / totalAffiliatesCount) * 100 : 0,
      avgGSDPerActiveAffiliate: affiliatesCreatingSalesCount > 0 ? totalRevenue / affiliatesCreatingSalesCount : 0,
      avgClicksPerActiveAffiliate: affiliatesCreatingSalesCount > 0 ? totalClicks / affiliatesCreatingSalesCount : 0,
      mentions: totalMentions,
      clicks: totalClicks,
      emv: totalEMV,
    },
    cost: {
      costPerClick: totalClicks > 0 ? totalCommission / totalClicks : 0,
      costPerOrder: totalOrders > 0 ? totalCommission / totalOrders : 0,
      commission: totalCommission,
    },
  };
}