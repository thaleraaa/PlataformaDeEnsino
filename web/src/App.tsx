import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import { Login } from './components/Login';
import { createRouter } from './routes';
import type { Role } from './mockData';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<Role>('ALUNO');
  const [userName, setUserName] = useState('');

  const handleLogin = (role: Role, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  const router = createRouter({ role: userRole, userName });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
