export const conclusaoAulaSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        dataConclusao: {
            type: 'string',
            format: 'date-time'
        },
        aluno_id: {
            type: 'string'
        },
        aula: {
            type: 'object',
            properties: {
                nome: {
                    type: 'string'
                },
                modulo: {
                    type: 'object',
                    properties: {
                        nome: {
                            type: 'string'
                        }
                    }
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

export const conclusaoAulaBodySchema = {
    type: 'object',
    required: ['aula_id'],
    properties: {
        aula_id: {
            type: 'string'
        }
    }
} as const;

const conclusaoAulaIdParamsSchema = {
    type: 'object',
    required: ['aula_id'],
    properties: {
        aula_id: {
            type: 'string'
        }
    }
} as const;

const conclusaoAulaAlunoAulaParamsSchema = {
    type: 'object',
    required: ['aula_id'],
    properties: {
        aula_id: {
            type: 'string'
        }
    }
} as const;

export const getConclusaoAulaByAlunoAndAulaSchema = {
    schema: {
        tags: ['Conclusões de Aula'],
        summary: 'Busca conclusão de aula por aluno e aula',
        security: [{ bearerAuth: [] }],
        params: conclusaoAulaAlunoAulaParamsSchema,
        response: {
            200: conclusaoAulaSchema
        },
    }
}

export const createConclusaoAulaSchema = {
    schema: {
        tags: ['Conclusões de Aula'],
        summary: 'Cria uma conclusão de aula',
        security: [{ bearerAuth: [] }],
        params: conclusaoAulaBodySchema,
        response: {
            201: conclusaoAulaSchema
        },
    }
}

export const deleteConclusaoAulaSchema = {
    schema: {
        tags: ['Conclusões de Aula'],
        summary: 'Deleta uma conclusão de aula',
        security: [{ bearerAuth: [] }],
        params: conclusaoAulaIdParamsSchema,
        response: {
            200: conclusaoAulaSchema
        },
    }
}