import { Card, CardContent, Typography, Grid } from '@mui/material';
import { formatNumber } from '../utils/numberFormat';

export default function AffiliateSection({ data }) {
  const renderValue = (value, unit = '') => {
    if (unit === '%') {
      return `${formatNumber(value, 'decimal', 2)}%`;
    } else if (unit === '$') {
      return `${formatNumber(value, 'currency', 2)}`;
    } else {
      return formatNumber(value, 'decimal', 0);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Affiliate Section</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Total Affiliates</Typography>
            <Typography variant="h6">{renderValue(data.totalAffiliates)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">New Affiliates</Typography>
            <Typography variant="h6">{renderValue(data.newAffiliates)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Affiliates Creating Sales</Typography>
            <Typography variant="h6">{renderValue(data.affiliatesCreatingSales)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">% of Affiliate Creating Sales</Typography>
            <Typography variant="h6">{renderValue(data.percentAffiliatesCreatingSales, '%')}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Avg Gross Sales per Active Affiliate</Typography>
            <Typography variant="h6">{renderValue(data.avgGSDPerActiveAffiliate, '$')}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Avg Clicks per Active Affiliate</Typography>
            <Typography variant="h6">{renderValue(data.avgClicksPerActiveAffiliate)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Mentions</Typography>
            <Typography variant="h6">{renderValue(data.mentions)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Clicks (ShopMy calls this "Views")</Typography>
            <Typography variant="h6">{renderValue(data.clicks)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Total EMV</Typography>
            <Typography variant="h6">{renderValue(data.emv, '$')}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
