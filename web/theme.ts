import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
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
      default: '#16171d',
      paper: '#1e1f26',
    },
    text: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
    },
    divider: '#2d2e36',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#16171d',
          borderRight: '1px solid #2d2e36',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1f26',
          borderBottom: '1px solid #2d2e36',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1f26',
          borderRadius: 8,
          border: '1px solid #2d2e36',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: '#6366f1',
            '&:hover': {
              backgroundColor: '#4f46e5',
            },
          },
        },
      },
    },
  },
});
