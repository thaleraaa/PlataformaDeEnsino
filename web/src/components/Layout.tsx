import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import {
  School,
  Book,
  Assignment,
  Assessment,
  Person,
  Settings,
  MenuBook,
  Groups,
  Quiz,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import type { Role } from '../mockData';

const DRAWER_WIDTH = 260;

interface LayoutProps {
  userRole: Role;
  userName: string;
}

export function Layout({ userRole, userName }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    switch (userRole) {
      case 'ALUNO':
        return [
          { text: 'Disciplinas', icon: <Book />, path: '/disciplinas' },
          { text: 'Simulados', icon: <Assignment />, path: '/simulados' },
          { text: 'Resultados', icon: <Assessment />, path: '/resultados' },
          { text: 'Perfil', icon: <Person />, path: '/perfil' },
        ];
      case 'PROFESSOR':
        return [
          { text: 'Disciplinas', icon: <MenuBook />, path: '/disciplinas' },
          { text: 'Criar Exercícios', icon: <Quiz />, path: '/criar-exercicios' },
          { text: 'Criar Simulados', icon: <Assignment />, path: '/criar-simulados' },
          { text: 'Alunos', icon: <Groups />, path: '/alunos' },
          { text: 'Perfil', icon: <Person />, path: '/perfil' },
        ];
      case 'ADMINISTRADOR':
        return [
          { text: 'Professores', icon: <Groups />, path: '/professores' },
          { text: 'Alunos', icon: <School />, path: '/alunos' },
          { text: 'Configurações', icon: <Settings />, path: '/configuracoes' },
          { text: 'Perfil', icon: <Person />, path: '/perfil' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, ml: `${DRAWER_WIDTH}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Plataforma MedEdu
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <School sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600}>
            MedEdu
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {userRole}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <List sx={{ px: 1, py: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          mt: 8,
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
