// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      background: {
        default: mode === 'dark' ? '#16171d' : '#f3f4f6',
        paper:   mode === 'dark' ? '#1e1f26' : '#ffffff',
      },
      text: {
        primary:   mode === 'dark' ? '#e5e7eb' : '#111827',
        secondary: mode === 'dark' ? '#9ca3af' : '#6b7280',
      },
      divider: mode === 'dark' ? '#2d2e36' : '#e5e7eb',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: '2rem',    fontWeight: 600 },
      h2: { fontSize: '1.5rem',  fontWeight: 600 },
      h3: { fontSize: '1.25rem', fontWeight: 600 },
      h4: { fontSize: '1.125rem',fontWeight: 500 },
      h5: { fontSize: '1rem',    fontWeight: 500 },
      h6: { fontSize: '0.875rem',fontWeight: 500 },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#16171d' : '#ffffff',
            borderRight: `1px solid ${mode === 'dark' ? '#2d2e36' : '#e5e7eb'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1f26' : '#ffffff',
            borderBottom: `1px solid ${mode === 'dark' ? '#2d2e36' : '#e5e7eb'}`,
            color: mode === 'dark' ? '#e5e7eb' : '#111827',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1f26' : '#ffffff',
            borderRadius: 8,
            border: `1px solid ${mode === 'dark' ? '#2d2e36' : '#e5e7eb'}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', borderRadius: 6 },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            margin: '4px 8px',
            '&.Mui-selected': {
              backgroundColor: '#6366f1',
              '&:hover': { backgroundColor: '#4f46e5' },
            },
          },
        },
      },
    },
  });