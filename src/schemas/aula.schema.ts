export const aulaSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        nome: {
            type: 'string'
        },
        videoAula: {
            type: 'string'
        },
        texto: {
            type: 'string'
        },
        modulo_id: {
            type: 'string'
        },
        created_at: {
            type: 'string',
            format: 'date-time'
        },
        updated_at: {
            type: 'string',
            format: 'date-time'
        },
    }
} as const;

export const aulaBodySchema = {
    type: 'object',
    required: [
        'nome', 'videoAula', 'texto', 'modulo_id'
    ],
    properties: {
        nome: {
            type: 'string'
        },
        videoAula: {
            type: 'string'
        },
        texto: {
            type: 'string'
        },
        modulo_id: {
            type: 'string'
        }
    }
} as const;

export const aulaUpdateBodySchema = {
    type: 'object',
    properties: {
        nome: {
            type: 'string'
        },
        videoAula: {
            type: 'string'
        },
        texto: {
            type: 'string'
        },
        modulo_id: {
            type: 'string'
        }
    }
} as const;

const aulaIdParamsSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        },
    }
} as const;

export const getAulaSchema = {
    schema: {
        tags: ['Aulas'],
        summary: 'Lista todas as aulas',
        security: [{ bearerAuth: [] }],
        response: {
            200: {
                type: 'array',
                items: aulaSchema
            },
        }
    }
}

export const getAulaByIdSchema = {
    schema: {
        tags: ['Aulas'],
        summary: 'Busca a aula pelo ID',
        security: [{ bearerAuth: [] }],
        params: aulaIdParamsSchema,
        response: {
            200: aulaSchema
        },
    }
}

export const postAulaSchema = {
    schema: {
        tags: ['Aulas'],
        summary: 'Cria uma aula',
        security: [{ bearerAuth: [] }],
        body: aulaBodySchema,
        response: {
            201: aulaSchema
        },
    }
}

export const putAulaSchema = {
    schema: {
        tags: ['Aulas'],
        summary: 'Atualiza os dados de uma aula',
        security: [{ bearerAuth: [] }],
        params: aulaIdParamsSchema,
        body: aulaUpdateBodySchema,
        response: {
            200: aulaSchema
        },
    }
}

export const deleteAulaSchema = {
    schema: {
        tags: ['Aulas'],
        summary: 'Delete uma aula',
        security: [{ bearerAuth: [] }],
        params: aulaIdParamsSchema,
        response: {
            200: aulaSchema
        },
    }
}

const aulaCountParamsSchema = {
    type: 'object',
    required: ['disciplina_id'],
    properties: {
        disciplina_id: {
            type: 'string'
        }
    }
} as const;

export const getAulaCountByDisciplinaSchema = {
    schema: {
        tags: ['Aulas'],
        summary: 'Conta o total de aulas de uma disciplina',
        security: [{ bearerAuth: [] }],
        params: aulaCountParamsSchema,
        response: {
            200: {
                type: 'number'
            },
        }
    }
}