export const resultadoSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        nota: {
            type: 'number'
        },
        tempoSegundos: {
            type: 'integer'
        },
        dataRealizacao: {
            type: 'string',
            format: 'date-time'
        },
        simulado_id: {
            type: 'string'
        },
        aluno_id: {
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

export const resultadoBodySchema = {
    type: 'object',
    required: ['nota', 'tempoSegundos', 'simulado_id'],
    properties: {
        nota: {
            type: 'number'
        },
        tempoSegundos: {
            type: 'integer'
        },
        dataRealizacao: {
            type: 'string',
            format: 'date-time'
        },
        simulado_id: {
            type: 'string'
        }
    }
} as const;

export const resultadoUpdateBodySchema = {
    type: 'object',
    properties: {
        nota: {
            type: 'number'
        },
        tempoSegundos: {
            type: 'integer'
        },
        dataRealizacao: {
            type: 'string',
            format: 'date-time'
        }
    }
} as const;

const resultadoIdParamsSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        }
    }
} as const;

const resultadoAlunoParamsSchema = {
    type: 'object',
    required: ['aluno_id'],
    properties: {
        aluno_id: {
            type: 'string'
        }
    }
} as const;

const resultadoSimuladoParamsSchema = {
    type: 'object',
    required: ['simulado_id'],
    properties: {
        simulado_id: {
            type: 'string'
        }
    }
} as const;

const resultadoAlunoSimuladoParamsSchema = {
    type: 'object',
    required: ['aluno_id', 'simulado_id'],
    properties: {
        aluno_id: {
            type: 'string'
        },
        simulado_id: {
            type: 'string'
        }
    }
} as const;

export const getResultadoSchema = {
    schema: {
        tags: ['Resultados'],
        summary: '(PROFESSOR) Lista todos os resultados',
        security: [{ bearerAuth: [] }],
        response: {
            200: {
                type: 'array',
                items: resultadoSchema
            },
        }
    }
}

export const getResultadoByIdSchema = {
    schema: {
        tags: ['Resultados'],
        summary: '(PROFESSOR/ADMINISTRADOR) Busca um resultado pelo ID',
        security: [{ bearerAuth: [] }],
        params: resultadoIdParamsSchema,
        response: {
            200: resultadoSchema
        },
    }
}

export const getResultadoByAlunoAndSimuladoSchema = {
    schema: {
        tags: ['Resultados'],
        summary: '(PROFESSOR/ADMINISTRADOR) Busca resultado de um aluno em um simulado específico',
        security: [{ bearerAuth: [] }],
        params: resultadoAlunoSimuladoParamsSchema,
        response: {
            200: resultadoSchema
        },
    }
}

export const getResultadoByAlunoSchema = {
    schema: {
        tags: ['Resultados'],
        summary: '(PROFESSOR/ADMINISTRADOR) Lista todos os resultados de um aluno',
        security: [{ bearerAuth: [] }],
        params: resultadoAlunoParamsSchema,
        response: {
            200: {
                type: 'array',
                items: resultadoSchema
            },
        }
    }
}

export const getResultadoByMeSchema = {
    schema: {
        tags: ['Resultados'],
        summary: 'Lista todos os seus resultados',
        security: [{ bearerAuth: [] }],
        response: {
            200: {
                type: 'array',
                items: resultadoSchema
            },
        }
    }
}


export const getResultadoBySimuladoSchema = {
    schema: {
        tags: ['Resultados'],
        summary: '(PROFESSOR/ADMINISTRADOR) Lista todos os resultados de um simulado',
        security: [{ bearerAuth: [] }],
        params: resultadoSimuladoParamsSchema,
        response: {
            200: {
                type: 'array',
                items: resultadoSchema
            },
        }
    }
}

export const createResultadoSchema = {
    schema: {
        tags: ['Resultados'],
        summary: 'Cria um novo resultado',
        security: [{ bearerAuth: [] }],
        body: resultadoBodySchema,
        response: {
            201: resultadoSchema
        },
    }
}

export const updateResultadoSchema = {
    schema: {
        tags: ['Resultados'],
        summary: '(PROFESSOR/ADMINISTRADOR) Atualiza um resultado',
        security: [{ bearerAuth: [] }],
        params: resultadoIdParamsSchema,
        body: resultadoUpdateBodySchema,
        response: {
            200: resultadoSchema
        },
    }
}

export const deleteResultadoSchema = {
    schema: {
        tags: ['Resultados'],
        summary: '(PROFESSOR/ADMINISTRADOR) Deleta um resultado',
        security: [{ bearerAuth: [] }],
        params: resultadoIdParamsSchema,
        response: {
            200: resultadoSchema
        },
    }
}