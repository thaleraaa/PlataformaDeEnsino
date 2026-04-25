export const exercicioSchema = {
  type: 'object',
  properties: {
    id: { 
        type: 'string' 
    },
    enunciado: { 
        type: 'string'
    },
    dificuldade: { 
        type: 'string'
    },
    professor_id: {
        type: 'string'
    },
    aula_id: {
        type: 'string'
    },
    simulado_id: {
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
  },
} as const;

export const exercicioBodySchema = {
    type: 'object',
    required: [
        'enunciado', 'dificuldade', 'professor_id'
    ],
    properties: {
        enunciado: {
            type: 'string'
        },
        dificuldade: {
            type: 'string'
        },
        professor_id: {
            type: 'string'
        },
        aula_id: {
            type: 'string'
        },
        simulado_id: {
            type: 'string'
        }
    }
} as const;

export const exercicioUpdateBodySchema = {
    type: 'object',
    required: [],
    properties: {
        enunciado: {
            type: 'string'
        },
        dificuldade: {
            type: 'string'
        },
        aula_id: {
            type: 'string'
        },
        simulado_id: {
            type: 'string'
        }
    }
} as const;

const exercicioIdParamsSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        }
    },
} as const;

export const getExercicioSchema = {
    schema: {
        tags: ['Exercicios'],
        summary: 'Lista todos os exercícios',
        response: {
            200: {
                type: 'array',
                items: exercicioSchema
            }
        }
    }
}

export const getExercicioByIdSchema = {
    schema: {
        tags: ['Exercicios'],
        summary: 'Busca o exercício pelo ID',
        params: exercicioIdParamsSchema,
        response: {
            200: exercicioSchema
        }
    }
}

export const postExercicioSchema = {
    schema: {
        tags: ['Exercicios'],
        summary: 'Cria um exercício',
        body: exercicioBodySchema,
        response: {
            201: exercicioSchema
        }
    }
}

export const putExercicioSchema = {
    schema: {
        tags: ['Exercicios'],
        summary: 'Atualiza os dados de um exercício',
        params: exercicioIdParamsSchema,
        body: exercicioUpdateBodySchema,
        response: {
            200: exercicioSchema
        }
    }
}

export const deleteExercicioSchema = {
    schema: {
        tags: ['Exercicios'],
        summary: 'Delete um exercício',
        params: exercicioIdParamsSchema,
        response: {
            200: exercicioSchema
        }
    }
}
