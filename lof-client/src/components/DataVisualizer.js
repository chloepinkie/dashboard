import { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';
import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import AffiliateSection from './AffiliateSection';
import CostSection from './CostSection';
import AffiliateSelector from './AffiliateSelector';
import { formatNumber } from '../utils/numberFormat';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DataVisualizer({ data, dateRange }) {
  console.log('DataVisualizer received data:', data);
  console.log('DataVisualizer received dateRange:', dateRange);

  const [processedData, setProcessedData] = useState({
    dailyStats: [],
    topAffiliates: [],
    overallStats: {},
    affiliateStats: {},
    costStats: {}
  });

  const [selectedAffiliate, setSelectedAffiliate] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const dailyStats = [];
      let totalRevenue = 0;
      let totalOrders = 0;
      let totalClicks = 0;
      let totalCommission = 0;
      let totalMentions = 0;
      let totalEMV = 0;
      const affiliatesMap = new Map();
      const startDate = new Date(dateRange.start);

      data.forEach(doc => {
        const date = doc.date;
        let dailyRevenue = 0;
        let dailyOrders = 0;
        let dailyClicks = 0;
        let dailyCommission = 0;
        let dailyMentions = 0;
        let dailyEMV = 0;

        doc.processedData.forEach(affiliate => {
          dailyRevenue += affiliate.orderVolume;
          dailyOrders += affiliate.orderCount;
          dailyClicks += affiliate.clicks;
          dailyCommission += affiliate.commissionsEarned;
          dailyMentions += affiliate.mentions;
          dailyEMV += affiliate.estimatedMediaValue;

          // Update affiliates map
          if (affiliatesMap.has(affiliate.User_id)) {
            const existingData = affiliatesMap.get(affiliate.User_id);
            affiliatesMap.set(affiliate.User_id, {
              ...existingData,
              orderVolume: existingData.orderVolume + affiliate.orderVolume,
              orderCount: existingData.orderCount + affiliate.orderCount,
              clicks: existingData.clicks + affiliate.clicks,
              mentions: existingData.mentions + affiliate.mentions,
              commissionsEarned: existingData.commissionsEarned + affiliate.commissionsEarned,
              estimatedMediaValue: existingData.estimatedMediaValue + affiliate.estimatedMediaValue
            });
          } else {
            affiliatesMap.set(affiliate.User_id, {
              name: affiliate.name,
              User_id: affiliate.User_id,
              instagram: affiliate.instagram,
              orderVolume: affiliate.orderVolume,
              orderCount: affiliate.orderCount,
              clicks: affiliate.clicks,
              mentions: affiliate.mentions,
              commissionsEarned: affiliate.commissionsEarned,
              estimatedMediaValue: affiliate.estimatedMediaValue,
              profilePic: affiliate.User_image,
              firstLinked: new Date(affiliate.firstLinked)
            });
          }
        });

        dailyStats.push({
          date,
          revenue: dailyRevenue,
          orders: dailyOrders,
          clicks: dailyClicks,
          commission: dailyCommission,
          mentions: dailyMentions,
          emv: dailyEMV
        });

        totalRevenue += dailyRevenue;
        totalOrders += dailyOrders;
        totalClicks += dailyClicks;
        totalCommission += dailyCommission;
        totalMentions += dailyMentions;
        totalEMV += dailyEMV;
      });

      const topAffiliates = Array.from(affiliatesMap.values())
        .sort((a, b) => b.orderVolume - a.orderVolume)
        .slice(0, 5);

      const newAffiliates = Array.from(affiliatesMap.values()).filter(
        affiliate => affiliate.firstLinked >= startDate
      ).length;

      const affiliatesCreatingSales = Array.from(affiliatesMap.values()).filter(
        affiliate => affiliate.orderCount > 0
      ).length;

      const avgGSDPerActiveAffiliate = affiliatesCreatingSales > 0
        ? totalRevenue / affiliatesCreatingSales
        : 0;

      const avgClicksPerActiveAffiliate = affiliatesCreatingSales > 0
        ? totalClicks / affiliatesCreatingSales
        : 0;

      // Calculate cost stats
      const costPerClick = totalClicks > 0 ? totalCommission / totalClicks : 0;
      const costPerOrder = totalOrders > 0 ? totalCommission / totalOrders : 0;

      setProcessedData({
        dailyStats,
        topAffiliates,
        overallStats: {
          totalRevenue: totalRevenue,
          totalOrders,
          totalClicks,
          totalCommission: totalCommission,
          averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders) : '0.00',
          totalAffiliates: affiliatesMap.size
        },
        affiliateStats: {
          totalAffiliates: affiliatesMap.size,
          newAffiliates,
          affiliatesCreatingSales,
          percentAffiliatesCreatingSales: (affiliatesCreatingSales / affiliatesMap.size * 100).toFixed(2),
          avgGSDPerActiveAffiliate: avgGSDPerActiveAffiliate,
          avgClicksPerActiveAffiliate: avgClicksPerActiveAffiliate.toFixed(0),
          mentions: totalMentions,
          clicks: totalClicks,
          emv: totalEMV
        },
        costStats: {
          costPerClick: costPerClick,
          costPerOrder: costPerOrder,
          commission: totalCommission
        }
      });
    }
  }, [data, dateRange]);

  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const { dailyStats, topAffiliates, overallStats, affiliateStats, costStats } = processedData;

  const renderValue = (value, unit = '') => {
    if (typeof value === 'number') {
      if (unit === '$') {
        return `${formatNumber(value, 'currency', 2, 2)}`;
      } else if (Number.isInteger(value)) {
        return formatNumber(value, 'decimal', 0, 0);
      } else {
        return formatNumber(value, 'decimal', 2, 2);
      }
    }
    return value;
  };

  const renderMetricCard = (title, value, unit = '') => (
    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">
        {renderValue(value, unit)}
      </Typography>
    </Paper>
  );

  const truncateName = (name, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    return name.substr(0, maxLength - 3) + '...';
  };

  const handleAffiliateClick = (affiliate) => {
    console.log('Affiliate clicked:', affiliate);
    setSelectedAffiliate(affiliate.User_id);
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Total Revenue', overallStats.totalRevenue, '$')}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Total Orders', overallStats.totalOrders)}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Avg Order Value', overallStats.averageOrderValue, '$')}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Total Affiliates', overallStats.totalAffiliates)}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Total Clicks', overallStats.totalClicks)}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Total Commission', overallStats.totalCommission, '$')}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Revenue Over Time</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `$${formatNumber(value)}`} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => `$${formatNumber(value)}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Orders vs Clicks</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyStats}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => value.toFixed(2)} />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="clicks" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Top 5 Affiliates by Order Volume</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topAffiliates} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `$${formatNumber(value)}`} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tickFormatter={(value) => truncateName(value)}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  return [
                    `$${formatNumber(value)}`,
                    'Order Volume'
                  ];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return (
                      <div>
                        <img src={payload[0].payload.profilePic} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', marginLeft: '10px' }} /><br />
                        <strong>Name:</strong> {payload[0].payload.name}<br />
                        <strong>Instagram:</strong> {payload[0].payload.instagram || 'N/A'}<br />
                      </div>
                    );
                  }
                  return label;
                }}
                wrapperStyle={{ zIndex: 1000 }}
              />
              <Legend />
              <Bar 
                dataKey="orderVolume" 
                fill="#8884d8" 
                name="Order Volume" 
                onClick={(data) => handleAffiliateClick(data)}
              />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Commission Over Time</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `$${formatNumber(value)}`} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => `$${formatNumber(value)}`} />
              <Legend />
              <Line type="monotone" dataKey="commission" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12}>
          <AffiliateSection data={affiliateStats} />
        </Grid>
        <Grid item xs={12}>
          <CostSection data={costStats} />
        </Grid>
        <Grid item xs={12}>
          <AffiliateSelector 
            data={data} 
            dateRange={dateRange} 
            selectedAffiliate={selectedAffiliate}
            onAffiliateSelect={setSelectedAffiliate}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
