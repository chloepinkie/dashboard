const jwt = require('jsonwebtoken');
const CsvData = require('../models/csvdata.model');

// Helper function to verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.getDashboardData = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const email = verifyToken(token);

    if (!email) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { startDate, endDate } = req.query;

    console.log('Received date range:', { startDate, endDate });

    const csvData = await CsvData.findOne().sort({ uploadedAt: -1 }).lean();

    if (!csvData) {
      return res.status(404).json({ error: 'No CSV data found' });
    }

    const filteredData = csvData.processedData.filter(row => {
      const rowDate = new Date(row.firstLinked);
      return (!startDate || rowDate >= new Date(startDate)) && 
             (!endDate || rowDate <= new Date(endDate));
    });

    const processedData = processCSVData(filteredData, startDate, endDate);

    res.json(processedData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'An error occurred while fetching dashboard data' });
  }
};

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
    const rowDate = row.firstLinked ? new Date(row.firstLinked) : null;
    if (rowDate && rowDate >= start && rowDate <= end) {
      const date = rowDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      totalRevenue += row.orderVolume;
      totalOrders += row.orderCount;
      totalAffiliates.add(row.username);
      if (row.orderCount > 0) affiliatesCreatingSales.add(row.username);
      totalClicks += row.clicks;
      totalMentions += row.mentions;
      totalEMV += row.estimatedMediaValue;
      totalCommission += row.commissionsEarned;

      // Aggregate daily data
      if (!dailyData[date]) {
        dailyData[date] = { 
          date, 
          revenue: 0, 
          orders: 0, 
          clicks: 0, 
          mentions: 0, 
          emv: 0, 
          commission: 0,
          affiliates: []
        };
      }
      dailyData[date].revenue += row.orderVolume;
      dailyData[date].orders += row.orderCount;
      dailyData[date].clicks += row.clicks;
      dailyData[date].mentions += row.mentions;
      dailyData[date].emv += row.estimatedMediaValue;
      dailyData[date].commission += row.commissionsEarned;
      dailyData[date].affiliates.push({
        name: row.name,
        username: row.username,
        instagram: row.instagram,
        orderVolume: row.orderVolume,
        orderCount: row.orderCount
      });
    }
  });

  const totalAffiliatesCount = totalAffiliates.size;
  const affiliatesCreatingSalesCount = affiliatesCreatingSales.size;

  // Convert daily data to array and sort by date
  const timeSeriesData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate top affiliates
  const allAffiliates = data.map(row => ({
    name: row.name,
    username: row.username,
    instagram: row.instagram,
    orderVolume: row.orderVolume
  }));

  const topAffiliates = allAffiliates
    .sort((a, b) => b.orderVolume - a.orderVolume)
    .slice(0, 5);

  const result = {
    salesData: timeSeriesData,
    topAffiliates: topAffiliates,
    sales: {
      revenue: totalRevenue,
      ordersGenerated: totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    },
    affiliate: {
      totalAffiliates: totalAffiliatesCount,
      newAffiliates: totalAffiliatesCount,
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

  console.log('Processed data:', JSON.stringify(result, null, 2));

  return result;
}

module.exports = {
  getDashboardData: exports.getDashboardData
};
