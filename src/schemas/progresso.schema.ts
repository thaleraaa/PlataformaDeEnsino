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
        disciplina_id: {
            type: 'string'
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
        summary: 'Lista o progresso de todos os alunos',
        response: {
            200: {
                type: 'array',
                items: progressoSchema
            }
        }
    }
};

export const getProgressoByAlunoSchema = {
    schema: {
        tags: ['Progresso'],
        summary: 'Busca o progresso de um aluno',
        params: progressoAlunoParamsSchema,
        response: {
            200: {
                type: 'array',
                items: progressoSchema
            }
        }
    }
};

export const getProgressoByDisciplinaSchema = {
    schema: {
        tags: ['Progresso'],
        summary: 'Busca o progresso dos alunos em uma disciplina',
        params: progressoDisciplinaParamsSchema,
        response: {
            200: {
                type: 'array',
                items: progressoSchema
            }
        }
    }
};
