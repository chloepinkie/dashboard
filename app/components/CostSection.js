import { Card, CardContent, Typography, Grid } from '@mui/material';

export default function CostSection({ data }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Cost Section</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Cost per Click</Typography>
            <Typography variant="h6">${data.costPerClick || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Cost per Order</Typography>
            <Typography variant="h6">${data.costPerOrder || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Commission</Typography>
            <Typography variant="h6">${data.commission || 0}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}