import { exercicioComEnunciado } from "./exercicio.schema";

export const simuladoSchema = {
    type: 'object',
    properties: {
        id: { 
            type: 'string' 
        },
        quantidadeQuestao: { 
            type: 'integer'
        },
        tempoMaximo: { 
            type: 'integer' 
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

export const simuladoBodySchema = {
    type: 'object',
    required: [
        'quantidadeQuestao', 'tempoMaximo'
    ],
    properties: {
        quantidadeQuestao: {
            type: 'integer'
        },
        tempoMaximo: {
            type: 'integer'
        }
    }
} as const;

export const simuladoUpdateBodySchema = {
    type: 'object',
    properties: {
        quantidadeQuestao: {
            type: 'integer'
        },
        tempoMaximo: {
            type: 'integer'
        }
    }
} as const;

const simuladoIdParamsSchema = {
    type: 'object',
    required: ['simulado_id'],
    properties: {
        simulado_id: {
            type: 'string'
        },
    }
} as const;

export const getSimuladoSchema = {
    schema: {
        tags: ['Simulados'],
        summary: 'Lista todos os simulados',
        response: {
            200: {
                type: 'array',
                items: simuladoSchema
            }
        },
        security: [{ bearerAuth: [] }]
    }
}

export const getSimuladoByIdSchema = {
    schema: {
        tags: ['Simulados'],
        summary: 'Busca um simulado por ID',
        params: simuladoIdParamsSchema,
        response: {
            200: simuladoSchema
        },
        security: [{ bearerAuth: [] }]
    }
}

export const createSimuladoSchema = {
    schema: {
        tags: ['Simulados'],
        summary: '(PROFESSOR) Cria um novo simulado',
        body: simuladoBodySchema,
        response: {
            201: simuladoSchema
        },
        security: [{ bearerAuth: [] }]
    }
}

export const updateSimuladoSchema = {
    schema: {
        tags: ['Simulados'],
        summary: '(PROFESSOR/ADMINISTRADOR) Atualiza um simulado',
        params: simuladoIdParamsSchema,
        body: simuladoUpdateBodySchema,
        response: {
            200: simuladoSchema
        },
        security: [{ bearerAuth: [] }]
    }
}

export const deleteSimuladoSchema = {
    schema: {
        tags: ['Simulados'],
        summary: '(PROFESSOR/ADMINISTRADOR) Deleta um simulado',
        params: simuladoIdParamsSchema,
        response: {
            200: simuladoSchema
        },
        security: [{ bearerAuth: [] }]
    }
}

export const getExerciciosBySimuladoSchema = {
    schema: {
        tags: ['Simulados'],
        summary: 'Lista todos os exercicios de um simulado',
        security: [{bearerAuth: []}],
        params: simuladoIdParamsSchema,
        response: {
            200: {
                type: 'array',
                items: exercicioComEnunciado
            }
        }
    }
}