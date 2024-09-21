// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0000', // Replace with exact brand red color hex
    },
    secondary: {
      main: '#FFFFFF', // White
    },
    background: {
      default: '#FFFFFF',
    },
  },
  typography: {
    // Define brand-specific typography if needed
  },
  // Additional customizations
});

export default theme;
