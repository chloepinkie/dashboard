import { Card, CardContent, Typography, Grid } from '@mui/material';
import DataVisualizer from './DataVisualizer';

export default function SalesSection({ data, dateRange }) {
  const salesData = data?.salesData || [];

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Sales Section</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Revenue</Typography>
            <Typography variant="h6">${data.revenue || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Orders Generated</Typography>
            <Typography variant="h6">{data.ordersGenerated || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Average Order Value</Typography>
            <Typography variant="h6">${data.averageOrderValue || 0}</Typography>
          </Grid>
          <Grid item xs={12}>
            <DataVisualizer 
              data={salesData} 
              dateRange={dateRange}
              dataKey="revenue"
              title="Sales Over Time"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}