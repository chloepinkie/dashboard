import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d9282f', // Left on Friday's brand red
    },
    secondary: {
      main: '#ffffff', // White as a secondary color
    },
    background: {
      default: '#ffffff', // White background
      paper: '#ffffff',
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#333333', // Slightly lighter black for secondary text
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h2: {
      fontSize: '2.5rem',
      color: '#000000', // Black text for headers
    },
    h5: {
      fontSize: '1.2rem',
      color: '#333333', // Slightly lighter black for subheaders
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: '2px',
          height: '0px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#d9282f',
          borderRadius: '6px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#b22025',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff', // White text for buttons
          backgroundColor: '#d9282f', // Red background for buttons
          '&:hover': {
            backgroundColor: '#b22025', // Darker red on hover
          },
        },
      },
    },
  },
});

export default theme;