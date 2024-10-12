import { Card, CardContent, Typography, Grid } from '@mui/material';
import DataVisualizer from './DataVisualizer';

export default function SalesSection({ data, dateRange }) {
  const salesData = data?.salesData || [];

  return (
    <Card>
      <CardContent>
          <Grid item xs={12}>
            <DataVisualizer 
              data={salesData} 
              dateRange={dateRange}
              dataKey="revenue"
              title="Sales Over Time"
            />
        </Grid>
      </CardContent>
    </Card>
  );
}