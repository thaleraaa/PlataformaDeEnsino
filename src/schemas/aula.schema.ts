import { exercicioComEnunciado } from "./exercicio.schema";

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
        'nome', 'videoAula', 'texto'
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
        }
    }
} as const;

const moduloIdParamsSchema = {
    type: 'object',
    required: ['modulo_id'],
    properties: {
        modulo_id: {
            type: 'string'
        },
    }
} as const;

const aulaIdParamsSchema = {
    type: 'object',
    required: ['aula_id'],
    properties: {
        aula_id: {
            type: 'string'
        },
    }
} as const;

const aulaIdAndModuloParamsSchema = {
    allOf: [aulaIdParamsSchema, moduloIdParamsSchema]
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
        summary: '(PROFESSOR) Cria uma aula',
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
        summary: '(PROFESSOR/ADMINISTRADOR) Atualiza os dados de uma aula',
        security: [{ bearerAuth: [] }],
        params: aulaIdAndModuloParamsSchema,
        body: aulaUpdateBodySchema,
        response: {
            200: aulaSchema
        },
    }
}

export const deleteAulaSchema = {
    schema: {
        tags: ['Aulas'],
        summary: '(PROFESSOR/ADMINISTRADOR) Delete uma aula',
        security: [{ bearerAuth: [] }],
        params: aulaIdParamsSchema,
        response: {
            200: aulaSchema
        },
    }
}

export const getExerciciosByAulaSchema = {
    schema: {
        tags: ['Aulas'],
        summary: 'Lista todos os exercicios de uma aula',
        security: [{bearerAuth: []}],
        params: aulaIdParamsSchema,
        response: {
            200: {
                type: 'array',
                items: exercicioComEnunciado
            }
        }
    }
}

