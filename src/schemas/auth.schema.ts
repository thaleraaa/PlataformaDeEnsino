const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    senha: { type: 'string' },
  },
  required: ['email', 'senha'],
} as const;

const alunoSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    periodo: { type: 'string' },
    faculdade: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    conta_id: { type: 'string' },
  },
} as const;

const professorSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    CRM: { type: 'string' },
    salario: { type: 'number' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    conta_id: { type: 'string' },
    adm_id: { type: 'string' },
  },
} as const;

const administradorSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    ativo: { type: 'boolean' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    conta_id: { type: 'string' },
  },
} as const;

const loginResponseSchema = {
  type: 'object',
  properties: {
    aluno: alunoSchema,
    professor: professorSchema,
    administrador: administradorSchema,
    token: { type: 'string' },
  },
  required: ['token'],
} as const;

export const getAuthSchema = {
  schema: {
    tags: ['Auth'],
    summary: 'Autentica um usuário e retorna um token JWT',
    body: loginSchema,
    response: { 200: loginResponseSchema },
  },
};
