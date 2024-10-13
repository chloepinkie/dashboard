import { Box, Typography } from '@mui/material';
import ScrollingText from './ScrollingText';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main' }}>
      <ScrollingText />
      <Typography align="center" sx={{ p: 2, color: 'primary.contrastText' }}>
          © {new Date().getFullYear()} Left On Friday. All rights reserved.
        </Typography>
      </Box>
  );
};

export default Footer;