// src/App.tsx
import { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './theme';           // ← mudou o import
import { Login } from './components/Login';
import { Register } from './components/Register';
import { createRouter } from './routes';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import type { Role } from './mockData';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<Role>('ALUNO');
  const [userName, setUserName] = useState('');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark'); // ← novo

  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);  // ← novo
  const toggleTheme = () =>
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));       // ← novo

  const handleLogin = (role: Role, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsAuthenticated(true);
  };

  const publicRouter = useMemo(() => createBrowserRouter([
    { path: '/', element: <Login onLogin={handleLogin} /> },
    { path: '/login', element: <Navigate to="/" replace /> },
    { path: '/register', element: <Register /> },
  ]), []);

  const authenticatedRouter = useMemo(() => {
    if (!isAuthenticated) return null;
    return createRouter({
      role: userRole,
      userName,
      themeMode,        // ← passa pro Layout via router
      toggleTheme,      // ← passa pro Layout via router
      onLogout: () => {
        setIsAuthenticated(false);
        setUserRole('ALUNO');
        setUserName('');
      },
    });
  }, [isAuthenticated, themeMode]); // ← adiciona themeMode na dep

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={isAuthenticated ? authenticatedRouter! : publicRouter} />
    </ThemeProvider>
  );
}