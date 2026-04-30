export const alternativaSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        texto: {
            type: 'string'
        },
        correta: {
            type: 'boolean'
        },
        created_at: {
            type: 'string',
            format: 'date-time'
        },
        updated_at: {
            type: 'string',
            format: 'date-time'
        },
        exercicio_id: {
            type: 'string'
        }
    }
} as const;

export const alternativaBodySchema = {
    type: 'object',
    required: [
        'texto', 'correta', 'exercicio_id'
    ],
    properties: {
        texto: {
            type: 'string'
        },
        correta: {
            type: 'boolean'
        },
        exercicio_id: {
            type: 'string'
        }
    }
} as const;

export const alternativaUpdateBodySchema = {
    type: 'object',
    properties: {
        texto: {
            type: 'string'
        },
        correta: {
            type: 'boolean'
        },
        exercicio_id: {
            type: 'string'
        }
    }
} as const;

const alternativaIdParamsSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        },
    }
} as const;

export const getAlternativaSchema = {
    schema: {
        tags: ['Alternativas'],
        summary: 'Lista todas as alternativas da plataforma',
        security: [{ bearerAuth: [] }],
        response: {
            200: {
                type: 'array',
                items: alternativaSchema
            },
        }
    }
}

export const getAlternativaByIdSchema = {
    schema: {
        tags: ['Alternativas'],
        summary: 'Busca a alternativa pelo ID',
        security: [{ bearerAuth: [] }],
        params: alternativaIdParamsSchema,
        response: {
            200: alternativaSchema
        },
    }
}

export const postAlternativaSchema = {
    schema: {
        tags: ['Alternativas'],
        summary: 'Cria uma alternativa',
        security: [{ bearerAuth: [] }],
        body: alternativaBodySchema,
        response: {
            201: alternativaSchema
        },
    }
}

export const putAlternativaSchema = {
    schema: {
        tags: ['Alternativas'],
        summary: 'Atualiza os dados de uma alternativa',
        security: [{ bearerAuth: [] }],
        params: alternativaIdParamsSchema,
        body: alternativaUpdateBodySchema,
        response: {
            200: alternativaSchema
        },
    }
}

export const deleteAlternativaSchema = {
    schema: {
        tags: ['Alternativas'],
        summary: 'Delete uma alternativa',
        security: [{ bearerAuth: [] }],
        params: alternativaIdParamsSchema,
        response: {
            200: alternativaSchema
        },
    }
}