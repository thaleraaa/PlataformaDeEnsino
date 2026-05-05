export const disciplinaSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        nome: {
            type: 'string'
        },
        professor_id: {
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

export const disciplinaBodySchema = {
    type: 'object',
    required: [
        'nome'
    ],
    properties: {
        nome: {
            type: 'string'
        }
    }
} as const;

export const disciplinaUpdateBodySchema = {
    type: 'object',
    properties: {
        nome: {
            type: 'string'
        }
    }
} as const;

const disciplinaIdParamsSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        },
    }
} as const;

export const getDisciplinaSchema = {
    schema: {
        tags: ['Disciplinas'],
        summary: 'Lista todas as disciplinas',
        response: {
            200: {
                type: 'array',
                items: disciplinaSchema
            }
        },
        security: [{ bearerAuth: [] }]
    }
}

export const getDisciplinaByIdSchema = {
    schema: {
        tags: ['Disciplinas'],
        summary: 'Busca a disciplina pelo ID',
        params: disciplinaIdParamsSchema,
        response: {
            200: disciplinaSchema
        },
        security: [{ bearerAuth: [] }]
    }
}

export const postDisciplinaSchema = {
    schema: {
        tags: ['Disciplinas'],
        summary: '(PROFESSOR) Cria uma disciplina',
        body: disciplinaBodySchema,
        response: {
            201: disciplinaSchema
        },
        security: [{ bearerAuth: [] }]
    }
}

export const putDisciplinaSchema = {
    schema: {
        tags: ['Disciplinas'],
        summary: '(PROFESSOR/ADMINISTRADOR) Atualiza os dados de uma disciplina',
        params: disciplinaIdParamsSchema,
        body: disciplinaUpdateBodySchema,
        response: {
            200: disciplinaSchema
        },
        security: [{ bearerAuth: [] }]
    }
}

export const deleteDisciplinaSchema = {
    schema: {
        tags: ['Disciplinas'],
        summary: '(PROFESSOR/ADMINISTRADOR) Delete uma disciplina',
        params: disciplinaIdParamsSchema,
        response: {
            200: disciplinaSchema
        },
        security: [{ bearerAuth: [] }]
    }
}