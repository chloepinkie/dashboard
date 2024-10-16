import React, { useState, useEffect } from 'react';
import { Typography, Box, Select, MenuItem, Grid, Paper } from '@mui/material';
import { formatNumber } from '../utils/numberFormat';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AffiliateSelector({ data, dateRange, selectedAffiliate, onAffiliateSelect }) {
  const [affiliateStats, setAffiliateStats] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  useEffect(() => {
    if (selectedAffiliate && data) {
      const stats = calculateAffiliateStats(selectedAffiliate, data);
      setAffiliateStats(stats);
      setTimeSeriesData(generateTimeSeriesData(selectedAffiliate, data));
    }
  }, [selectedAffiliate, data]);

  const calculateAffiliateStats = (affiliateId, data) => {
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalClicks = 0;
    let totalCommission = 0;
    let affiliateInfo = null;

    data.forEach(doc => {
      const affiliate = doc.processedData.find(a => a.User_id === affiliateId);
      if (affiliate) {
        totalOrders += affiliate.orderCount;
        totalRevenue += affiliate.orderVolume;
        totalClicks += affiliate.clicks;
        totalCommission += affiliate.commissionsEarned;
        if (!affiliateInfo) {
          affiliateInfo = {
            name: affiliate.name,
            instagram: affiliate.instagram,
            profilePic: affiliate.User_image
          };
        }
      }
    });

    return {
      ...affiliateInfo,
      totalOrders,
      totalRevenue,
      totalClicks,
      totalCommission,
      conversionRate: totalClicks > 0 ? (totalOrders / totalClicks * 100).toFixed(2) : 0
    };
  };

  const generateTimeSeriesData = (affiliateId, data) => {
    return data.map(doc => {
      const affiliate = doc.processedData.find(a => a.User_id === affiliateId);
      return {
        date: doc.date,
        revenue: affiliate ? affiliate.orderVolume : 0,
        clicks: affiliate ? affiliate.clicks : 0,
        orders: affiliate ? affiliate.orderCount : 0
      };
    });
  };

  const renderValue = (value, unit = '') => {
    if (unit === '%') {
      return `${formatNumber(value, 'decimal', 2)}%`;
    } else if (unit === '$') {
      return `${formatNumber(value, 'currency', 2)}`;
    } else {
      return formatNumber(value, 'decimal', 0);
    }
  };

  const renderStatCard = (title, value, unit = '') => (
    <Grid item xs={6} sm={4} md={3}>
      <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="h6">{renderValue(value, unit)}</Typography>
      </Paper>
    </Grid>
  );

  const renderTimeSeriesChart = (title, dataKey, color) => (
    <Grid item xs={12} md={4}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timeSeriesData}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(value) => renderValue(value, dataKey === 'revenue' ? '$' : '')} />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={color} />
        </LineChart>
      </ResponsiveContainer>
    </Grid>
  );

  // Get unique affiliates from all data
  const affiliates = data ? [...new Set(data.flatMap(doc => doc.processedData.map(a => a.User_id)))]
    .map(id => {
      const affiliate = data.flatMap(doc => doc.processedData).find(a => a.User_id === id);
      return { id, name: affiliate.name };
    })
    .sort((a, b) => a.name.localeCompare(b.name)) : [];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Select Affiliate</Typography>
      <Select
        value={selectedAffiliate || ''}
        onChange={(e) => onAffiliateSelect(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="">
          <em>Select an affiliate</em>
        </MenuItem>
        {affiliates.map((affiliate) => (
          <MenuItem key={affiliate.id} value={affiliate.id}>{affiliate.name}</MenuItem>
        ))}
      </Select>

      {affiliateStats && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <img src={affiliateStats.profilePic} alt={affiliateStats.name} style={{ width: 100, height: 100, borderRadius: '50%', marginLeft: 10 }} />
            <Typography marginLeft={2} variant="h5">{affiliateStats.name}</Typography>
          </Box>
          <Typography variant="subtitle1" gutterBottom>Instagram: {affiliateStats.instagram}</Typography>
          <Grid container spacing={2}>
            {renderStatCard('Total Orders', affiliateStats.totalOrders)}
            {renderStatCard('Total Revenue', affiliateStats.totalRevenue, '$')}
            {renderStatCard('Total Clicks', affiliateStats.totalClicks)}
            {renderStatCard('Total Commission', affiliateStats.totalCommission, '$')}
            {renderStatCard('Conversion Rate', affiliateStats.conversionRate, '%')}
          </Grid>
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>Performance Over Time</Typography>
            <Grid container spacing={3}>
              {renderTimeSeriesChart('Revenue Over Time', 'revenue', '#8884d8')}
              {renderTimeSeriesChart('Clicks Over Time', 'clicks', '#82ca9d')}
              {renderTimeSeriesChart('Orders Over Time', 'orders', '#ffc658')}
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
}
