import { aulaSchema } from "./aula.schema";

export const moduloSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        nome: {
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

export const moduloBodySchema = {
    type: 'object',
    required: [
        'nome', 'disciplina_id'
    ],
    properties: {
        nome: {
            type: 'string'
        },
        disciplina_id: {
            type: 'string'
        }
    }
} as const;

export const moduloUpdateBodySchema = {
    type: 'object',
    properties: {
        nome: {
            type: 'string'
        },
        disciplina_id: {
            type: 'string'
        }
    }
} as const;

const moduloIdParamsSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        },
    }
} as const;

export const getAulasByModuloIdSchema = {
    schema: {
        tags: ['Modulos'],
        summary: 'Busca todas as aulas de um modulo',
        params: moduloIdParamsSchema,
        security: [{ bearerAuth: [] }],
        response: {
            200: {
                type: 'array',
                items: aulaSchema
            }
        }
    }
}

export const getModuloSchema = {
    schema: {
        tags: ['Modulos'],
        summary: 'Lista todos os módulos',
        response: {
            200: {
                type: 'array',
                items: moduloSchema
            }
        },
        security: [{ bearerAuth: [] }]
    }
}

export const getModuloByIdSchema = {
    schema: {
        tags: ['Modulos'],
        summary: 'Busca o módulo pelo ID',
        params: moduloIdParamsSchema,
        response: {
            200: moduloSchema
        },
        security: [{ bearerAuth: [] }]
    }
}

export const postModuloSchema = {
    schema: {
        tags: ['Modulos'],
        summary: '(PROFESSOR) Cria um módulo',
        body: moduloBodySchema,
        response: {
            201: moduloSchema
        },
        security: [{ bearerAuth: [] }]
    }
}

export const putModuloSchema = {
    schema: {
        tags: ['Modulos'],
        summary: '(PROFESSOR/ADMINISTRADOR) Atualiza os dados de um módulo',
        params: moduloIdParamsSchema,
        body: moduloUpdateBodySchema,
        response: {
            200: moduloSchema
        },
        security: [{ bearerAuth: [] }]
    }
}

export const deleteModuloSchema = {
    schema: {
        tags: ['Modulos'],
        summary: '(PROFESSOR/ADMINISTRADOR) Delete um módulo',
        params: moduloIdParamsSchema,
        response: {
            200: moduloSchema
        },
        security: [{ bearerAuth: [] }]
    }
}