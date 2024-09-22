"use client";

import { ThemeProvider } from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
