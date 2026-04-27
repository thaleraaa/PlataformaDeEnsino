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
        'quantidadeQuestao', 'tempoMaximo', 'professor_id'
    ],
    properties: {
        quantidadeQuestao: {
            type: 'integer'
        },
        tempoMaximo: {
            type: 'integer'
        },
        professor_id: {
            type: 'string'
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
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        }
    },
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
        }
    }
}

export const getSimuladoByIdSchema = {
    schema: {
        tags: ['Simulados'],
        summary: 'Busca um simulado por ID',
        params: simuladoIdParamsSchema,
        response: {
            200: simuladoSchema
        }
    }
}

export const createSimuladoSchema = {
    schema: {
        tags: ['Simulados'],
        summary: 'Cria um novo simulado',
        body: simuladoBodySchema,
        response: {
            201: simuladoSchema
        }
    }
}

export const updateSimuladoSchema = {
    schema: {
        tags: ['Simulados'],
        summary: 'Atualiza um simulado',
        params: simuladoIdParamsSchema,
        body: simuladoUpdateBodySchema,
        response: {
            200: simuladoSchema
        }
    }
}

export const deleteSimuladoSchema = {
    schema: {
        tags: ['Simulados'],
        summary: 'Deleta um simulado',
        params: simuladoIdParamsSchema,
        response: {
            200: simuladoSchema
        }
    }
}