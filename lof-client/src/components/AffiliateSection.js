import { Card, CardContent, Typography, Grid } from '@mui/material';

export default function AffiliateSection({ data }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Affiliate Section</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Total Affiliates</Typography>
            <Typography variant="h6">{data.totalAffiliates || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">New Affiliates</Typography>
            <Typography variant="h6">{data.newAffiliates || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Affiliates Creating Sales</Typography>
            <Typography variant="h6">{data.affiliatesCreatingSales || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">% of Affiliate Creating Sales</Typography>
            <Typography variant="h6">{data.percentAffiliatesCreatingSales || 0}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Avg GS-D per Active Affiliate</Typography>
            <Typography variant="h6">{data.avgGSDPerActiveAffiliate || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Avg Clicks per Active Affiliate</Typography>
            <Typography variant="h6">{data.avgClicksPerActiveAffiliate || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Mentions</Typography>
            <Typography variant="h6">{data.mentions || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Clicks</Typography>
            <Typography variant="h6">{data.clicks || 0}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">EMV</Typography>
            <Typography variant="h6">${data.emv || 0}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}