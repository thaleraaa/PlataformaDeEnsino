export const progressoSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        porcentagemConcluida: {
            type: 'number'
        },
        aluno_id: {
            type: 'string'
        },
        disciplina: {
            type: 'object',
            properties: {
                nome: {
                    type: 'string'
                }
            }
        }, 
        created_at: {
            type: 'string',
            format: 'date-time'
        },
        updated_at: {
            type: 'string',
            format: 'date-time'
        }
    }
} as const;

const progressoAlunoParamsSchema = {
    type: 'object',
    required: ['aluno_id'],
    properties: {
        aluno_id: {
            type: 'string'
        }
    }
} as const;

const progressoDisciplinaParamsSchema = {
    type: 'object',
    required: ['disciplina_id'],
    properties: {
        disciplina_id: {
            type: 'string'
        }
    }
} as const;

export const getProgressoSchema = {
    schema: {
        tags: ['Progresso'],
        summary: '(PROFESSOR/ADMINISTRADOR) Lista o progresso de todos os alunos',
        response: {
            200: {
                type: 'array',
                items: progressoSchema
            }
        },
        security: [{ bearerAuth: [] }]
    }
};

export const getMeProgressoSchema = {
    schema: {
        tags: ['Progresso'],
        summary: 'Lista o seu progresso',
        response: {
            200: {
                type: 'array',
                items: progressoSchema
            }
        },
        security: [{ bearerAuth: [] }]
    }
};

export const getProgressoByAlunoSchema = {
    schema: {
        tags: ['Progresso'],
        summary: '(PROFESSOR/ADMINISTRADOR) Busca o progresso de um aluno',
        params: progressoAlunoParamsSchema,
        response: {
            200: {
                type: 'array',
                items: progressoSchema
            }
        },
        security: [{ bearerAuth: [] }]
    }
};

export const getProgressoByDisciplinaSchema = {
    schema: {
        tags: ['Progresso'],
        summary: '(PROFESSOR/ADMINISTRADOR) Busca o progresso dos alunos em uma disciplina',
        params: progressoDisciplinaParamsSchema,
        response: {
            200: {
                type: 'array',
                items: progressoSchema
            }
        },
        security: [{ bearerAuth: [] }]
    }
};
