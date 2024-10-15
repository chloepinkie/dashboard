import { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';
import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DataVisualizer({ data, dateRange }) {
  console.log('DataVisualizer received data:', JSON.stringify(data, null, 2));
  console.log('DataVisualizer received dateRange:', dateRange);

  if (!data) {
    return <Typography>No data available</Typography>;
  }

  const { salesData, topAffiliates, sales, affiliate, cost } = data;

  const renderMetricCard = (title, value, unit = '') => (
    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{typeof value === 'number' ? value.toFixed(2) : value}{unit}</Typography>
    </Paper>
  );

  const truncateName = (name, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    return name.substr(0, maxLength - 3) + '...';
  };

  return (
    <Box>
      <Typography variant="body2" color="textSecondary">
        Debug Info: Data received: Yes, 
        Sales Data Length: {salesData?.length || 0}, 
        Top Affiliates: {topAffiliates?.length || 0}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Total Revenue', sales?.revenue, '$')}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Total Orders', sales?.ordersGenerated)}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Avg Order Value', sales?.averageOrderValue, '$')}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Total Affiliates', affiliate?.totalAffiliates)}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Total Clicks', affiliate?.clicks)}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderMetricCard('Total Commission', cost?.commission, '$')}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Revenue Over Time</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Orders vs Clicks</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
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
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tickFormatter={(value) => truncateName(value)}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  return [
                    `$${value.toFixed(2)}`,
                    'Order Volume'
                  ];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return (
                      <div>
                        <strong>Name:</strong> {payload[0].payload.name}<br />
                        <strong>Instagram:</strong> {payload[0].payload.instagram || 'N/A'}<br />
                      </div>
                    );
                  }
                  return label;
                }}
                wrapperStyle={{ zIndex: 1000 }} // Add this line to increase z-index
              />
              <Legend />
              <Bar dataKey="orderVolume" fill="#8884d8" name="Order Volume" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Commission vs EMV</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="commission" stroke="#8884d8" />
              <Line yAxisId="right" type="monotone" dataKey="emv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
