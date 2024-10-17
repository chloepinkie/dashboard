import { Card, CardContent, Typography, Grid } from '@mui/material';
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

export default function CostSection({ data }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Cost Section</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Cost per Click</Typography>
            <Typography variant="h6">{renderValue(data.costPerClick, '$')}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Cost per Order</Typography>
            <Typography variant="h6">{renderValue(data.costPerOrder, '$')}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Total Commission</Typography>
            <Typography variant="h6">{renderValue(data.commission, '$')}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}