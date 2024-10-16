import { Card, CardContent, Typography, Grid } from '@mui/material';
import DataVisualizer from './DataVisualizer';
import { formatNumber } from '../utils/numberFormat';

const renderValue = (value, unit = '') => {
  if (unit === '%') {
    return `${formatNumber(value, 'decimal', 2)}%`;
  } else if (unit === '$') {
    return `${formatNumber(value, 'currency', 2)}`;
  } else {
    return formatNumber(value, 'decimal', 0);
  }
};
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