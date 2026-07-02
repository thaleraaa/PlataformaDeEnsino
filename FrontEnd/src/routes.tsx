import { createBrowserRouter, redirect } from 'react-router-dom';
import { Disciplinas } from './pages/Disciplinas';
import { Aula } from './pages/Aula';
import { Simulados } from './pages/Simulados';
import { Resultados } from './pages/Resultados';
import { Layout } from './components/Layout';
import type { Role } from './mockData';
import { DisciplinasProfessor } from './pages/DisciplinasProfessor';
import { CriarExercicio } from './pages/CriarExercicio';
import { Register } from './components/Register';
import { GerenciarProfessores } from './pages/GerenciarProfessores';
import { Perfil } from './pages/Perfil';
import { GerenciarAdministradores } from './pages/GerenciarAdministradores';
import { GerenciarAlunos } from './pages/GerenciarAlunos';
import { SimuladosProfessor } from './pages/SimuladosProfessor';
import { Navigate } from 'react-router-dom';

interface RouteConfig {
  role: Role;
  userName: string;
  onLogout: () => void;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
}

export const createRouter = (config: RouteConfig) => {
  const defaultPath = config.role === 'ADMINISTRADOR' ? '/professores' : '/disciplinas';

  const baseChildren: any[] = [
    {
      index: true,
      loader: () => redirect(defaultPath),
    },
  ];

  if (config.role === 'ALUNO') {
    baseChildren.push(
      { path: 'disciplinas', Component: Disciplinas },
      { path: 'aula/:id', Component: Aula },
      { path: 'simulados', Component: Simulados },
      { path: 'resultados', Component: Resultados },
      { path: 'perfil', Component: () => <Perfil userRole="ALUNO" onLogout={config.onLogout} /> }
    );
  }

  if (config.role === 'PROFESSOR') {
    baseChildren.push(
      { path: 'disciplinas', Component: DisciplinasProfessor },
      { path: 'criar-exercicios', Component: CriarExercicio },
      { path: 'criar-simulados', Component: SimuladosProfessor },
      { path: 'perfil', Component: () => <Perfil userRole="PROFESSOR" onLogout={config.onLogout} /> },
      { path: 'aula/:id', Component: Aula }
    );
  }

  if (config.role === 'ADMINISTRADOR') {
    baseChildren.push(
      { path: 'professores', Component: GerenciarProfessores },
      { path: 'alunos', Component: GerenciarAlunos },
      { path: 'perfil', Component: () => <Perfil userRole="ADMINISTRADOR" onLogout={config.onLogout} /> },
      { path: 'administradores', Component: GerenciarAdministradores },
    );
  }

  return createBrowserRouter([
    {
      path: '/',
      element: (
        <Layout
          userRole={config.role}
          userName={config.userName}
          onLogout={config.onLogout}
          themeMode={config.themeMode}
          toggleTheme={config.toggleTheme}
        />
      ),
      children: baseChildren,
    },
    {
      path: '/login',
      element: <Navigate to="/" replace />,
    },
    {
      path: '/register',
      Component: Register,
    },
  ]);
};