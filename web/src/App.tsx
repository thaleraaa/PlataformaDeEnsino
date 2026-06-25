import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { createRouter } from './routes';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
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

  // na chamada de createRouter, adiciona onLogout:
  const router = createRouter({
    role: userRole,
    userName,
    onLogout: () => {
      setIsAuthenticated(false);
      setUserRole('ALUNO');
      setUserName('');
    },
  });

  // router simples sem path: '*'
  const publicRouter = createBrowserRouter([
    { path: '/', element: <Login onLogin={handleLogin} /> },
    { path: '/register', element: <Register /> },
  ]);

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={publicRouter} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}