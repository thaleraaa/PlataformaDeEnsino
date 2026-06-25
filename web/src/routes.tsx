import { createBrowserRouter } from 'react-router-dom';
import { DashboardAluno } from './pages/DashboardAluno';
import { DashboardProfessor } from './pages/DashboardProfessor';
import { DashboardAdmin } from './pages/DashboardAdmin';
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

interface RouteConfig {
  role: Role;
  userName: string;
  onLogout: () => void;
}

export const createRouter = (config: RouteConfig) => {
  const getDashboard = () => {
    switch (config.role) {
      case 'ALUNO':
        return DashboardAluno;
      case 'PROFESSOR':
        return DashboardProfessor;
      case 'ADMINISTRADOR':
        return DashboardAdmin;
    }
  };

  const baseChildren = [
    {
      index: true,
      Component: getDashboard(),
    },
    {
      path: 'dashboard',
      Component: getDashboard(),
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
      { path: 'criar-simulados', Component: () => <div>Criar Simulados</div> },
      { path: 'alunos', Component: () => <div>Gerenciar Alunos</div> },
      { path: 'perfil', Component: () => <Perfil userRole="PROFESSOR" onLogout={config.onLogout} /> },
      { path: 'aula/:id', Component: Aula }
    );
  }

  if (config.role === 'ADMINISTRADOR') {
    baseChildren.push(
      { path: 'professores', Component: GerenciarProfessores },
      { path: 'alunos', Component: () => <div>Gerenciar Alunos</div> },
      { path: 'configuracoes', Component: () => <div>Configurações</div> },
      { path: 'perfil', Component: () => <Perfil userRole="ADMINISTRADOR" onLogout={config.onLogout} /> }
    );
  }

  return createBrowserRouter([
    {
      path: '/',
      element: <Layout userRole={config.role} userName={config.userName} />,
      children: baseChildren,
    },
    {
      path: '/register',
      Component: Register,
    },
  ]);
};
