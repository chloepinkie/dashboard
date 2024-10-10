import { useState, useEffect } from 'react';
import { Typography, Box, Select, MenuItem } from '@mui/material';
import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DataVisualizer({ data, dateRange, dataKey, title }) {
  const [filteredData, setFilteredData] = useState([]);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    if (data && dateRange.start && dateRange.end) {
      const filtered = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= new Date(dateRange.start) && itemDate <= new Date(dateRange.end);
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, dateRange]);

  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const renderChart = () => {
    switch(chartType) {
      case 'bar':
        return (
          <BarChart width={600} height={300} data={filteredData}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#8884d8" />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart width={400} height={400}>
            <Pie
              data={filteredData}
              cx={200}
              cy={200}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return (
          <LineChart width={600} height={300} data={filteredData}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
          </LineChart>
        );
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Select
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="line">Line Chart</MenuItem>
        <MenuItem value="bar">Bar Chart</MenuItem>
        <MenuItem value="pie">Pie Chart</MenuItem>
      </Select>
      {renderChart()}
    </Box>
  );
}