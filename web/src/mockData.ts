export type Role = 'ADMINISTRADOR' | 'PROFESSOR' | 'ALUNO';

export interface Conta {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: Role;
}

export interface Aluno {
  id: string;
  periodo: string;
  faculdade: string;
  conta_id: string;
  conta: Conta;
}

export interface Professor {
  id: string;
  CRM: string;
  salario: number;
  ativo: boolean;
  conta_id: string;
  conta: Conta;
}

export interface Administrador {
  id: string;
  ativo: boolean;
  conta_id: string;
  conta: Conta;
}

export interface Disciplina {
  id: string;
  nome: string;
  professor_id: string;
  modulos: Modulo[];
}

export interface Modulo {
  id: string;
  nome: string;
  disciplina_id: string;
  aulas: Aula[];
}

export interface Aula {
  id: string;
  nome: string;
  videoAula: string;
  texto: string;
  modulo_id: string;
}

export interface Exercicio {
  id: string;
  enunciado: string;
  dificuldade: string;
  aula_id?: string;
  alternativas: Alternativa[];
}

export interface Alternativa {
  id: string;
  texto: string;
  correta: boolean;
  exercicio_id: string;
}

export interface Simulado {
  id: string;
  quantidadeQuestao: number;
  tempoMaximo: number;
  professor_id: string;
}

export interface Progresso {
  id: string;
  porcentagemConcluida: number;
  aluno_id: string;
  disciplina_id: string;
}

export interface Resultado {
  id: string;
  nota: number;
  tempoSegundos: number;
  dataRealizacao: string;
  simulado_id: string;
  aluno_id: string;
}

// Mock Data
export const mockContas: Conta[] = [
  {
    id: '1',
    nome: 'Dr. João Silva',
    email: 'joao.silva@med.com',
    senha: '123456',
    role: 'PROFESSOR',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@aluno.com',
    senha: '123456',
    role: 'ALUNO',
  },
  {
    id: '3',
    nome: 'Admin Sistema',
    email: 'admin@plataforma.com',
    senha: '123456',
    role: 'ADMINISTRADOR',
  },
];

export const mockDisciplinas: Disciplina[] = [
  {
    id: 'd1',
    nome: 'Anatomia Humana',
    professor_id: '1',
    modulos: [
      {
        id: 'm1',
        nome: 'Sistema Cardiovascular',
        disciplina_id: 'd1',
        aulas: [
          {
            id: 'a1',
            nome: 'Introdução ao Coração',
            videoAula: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            texto: 'O coração é um órgão muscular responsável por bombear sangue...',
            modulo_id: 'm1',
          },
          {
            id: 'a2',
            nome: 'Vasos Sanguíneos',
            videoAula: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            texto: 'Os vasos sanguíneos formam uma rede complexa...',
            modulo_id: 'm1',
          },
        ],
      },
      {
        id: 'm2',
        nome: 'Sistema Respiratório',
        disciplina_id: 'd1',
        aulas: [
          {
            id: 'a3',
            nome: 'Estrutura dos Pulmões',
            videoAula: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            texto: 'Os pulmões são órgãos pares localizados na cavidade torácica...',
            modulo_id: 'm2',
          },
        ],
      },
    ],
  },
  {
    id: 'd2',
    nome: 'Fisiologia',
    professor_id: '1',
    modulos: [
      {
        id: 'm3',
        nome: 'Fisiologia Cardiovascular',
        disciplina_id: 'd2',
        aulas: [
          {
            id: 'a4',
            nome: 'Ciclo Cardíaco',
            videoAula: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            texto: 'O ciclo cardíaco consiste em sístole e diástole...',
            modulo_id: 'm3',
          },
        ],
      },
    ],
  },
  {
    id: 'd3',
    nome: 'Patologia',
    professor_id: '1',
    modulos: [
      {
        id: 'm4',
        nome: 'Patologia Geral',
        disciplina_id: 'd3',
        aulas: [
          {
            id: 'a5',
            nome: 'Inflamação',
            videoAula: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            texto: 'A inflamação é uma resposta do organismo a lesões...',
            modulo_id: 'm4',
          },
        ],
      },
    ],
  },
];

export const mockExercicios: Exercicio[] = [
  {
    id: 'e1',
    enunciado: 'Qual é a principal função do ventrículo esquerdo?',
    dificuldade: 'Médio',
    aula_id: 'a1',
    alternativas: [
      {
        id: 'alt1',
        texto: 'Bombear sangue para os pulmões',
        correta: false,
        exercicio_id: 'e1',
      },
      {
        id: 'alt2',
        texto: 'Bombear sangue para todo o corpo',
        correta: true,
        exercicio_id: 'e1',
      },
      {
        id: 'alt3',
        texto: 'Receber sangue dos pulmões',
        correta: false,
        exercicio_id: 'e1',
      },
      {
        id: 'alt4',
        texto: 'Armazenar sangue',
        correta: false,
        exercicio_id: 'e1',
      },
    ],
  },
  {
    id: 'e2',
    enunciado: 'Quais são as camadas do coração?',
    dificuldade: 'Fácil',
    aula_id: 'a1',
    alternativas: [
      {
        id: 'alt5',
        texto: 'Endocárdio, miocárdio e epicárdio',
        correta: true,
        exercicio_id: 'e2',
      },
      {
        id: 'alt6',
        texto: 'Pleura, pericárdio e endocárdio',
        correta: false,
        exercicio_id: 'e2',
      },
      {
        id: 'alt7',
        texto: 'Músculo liso, estriado e cardíaco',
        correta: false,
        exercicio_id: 'e2',
      },
      {
        id: 'alt8',
        texto: 'Átrio, ventrículo e válvula',
        correta: false,
        exercicio_id: 'e2',
      },
    ],
  },
];

export const mockSimulados: Simulado[] = [
  {
    id: 's1',
    quantidadeQuestao: 50,
    tempoMaximo: 180,
    professor_id: '1',
  },
  {
    id: 's2',
    quantidadeQuestao: 100,
    tempoMaximo: 240,
    professor_id: '1',
  },
];

export const mockProgressos: Progresso[] = [
  {
    id: 'p1',
    porcentagemConcluida: 65,
    aluno_id: '2',
    disciplina_id: 'd1',
  },
  {
    id: 'p2',
    porcentagemConcluida: 40,
    aluno_id: '2',
    disciplina_id: 'd2',
  },
  {
    id: 'p3',
    porcentagemConcluida: 15,
    aluno_id: '2',
    disciplina_id: 'd3',
  },
];

export const mockResultados: Resultado[] = [
  {
    id: 'r1',
    nota: 8.5,
    tempoSegundos: 9600,
    dataRealizacao: '2026-05-15T10:00:00Z',
    simulado_id: 's1',
    aluno_id: '2',
  },
  {
    id: 'r2',
    nota: 7.2,
    tempoSegundos: 12000,
    dataRealizacao: '2026-05-20T14:30:00Z',
    simulado_id: 's2',
    aluno_id: '2',
  },
];
