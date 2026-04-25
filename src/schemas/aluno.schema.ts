export const alunoSchema = {
  type: 'object',
  properties: {
    id: { 
        type: 'string' 
    },
    nome: { 
        type: 'string'
    },
    periodo: { 
        type: 'string' 
    },
    faculdade: {
        type: 'string'
    },
    email: {
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

export const alunoBodySchema = {
    type: 'object',
    required: [
        'nome', 'periodo', 'faculdade',
        'email'
    ],
    properties: {
        nome: {
            type: 'string'
        }, 
        periodo: {
            type: 'string'
        },
        faculdade: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        senha: {
            type: 'string'
        }
    }
} as const;

export const alunoUpdateBodySchema = {
    type: 'object',
    properties: {
        nome: {
            type: 'string'
        }, 
        periodo: {
            type: 'string'
        },
        faculdade: {
            type: 'string'
        },
        email: {
            type: 'string'
        }
    }
} as const;

const alunoIdParamsSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        }
    },
} as const;

export const getAlunoSchema = {
    schema: {
        tags: ['Alunos'],
        summary: 'Lista todos os alunos',
        // security: [
        //     {
        //         bearerAuth: []
        //     }
        // ],
        response: {
            200: {
                type: 'array',
                items: alunoSchema
            }
        }
    }
}

export const getAlunoByIdSchema = {
    schema: {
        tags: ['Alunos'],
        summary: 'Busca o aluno pelo ID',
        response: {
            200: {
                alunoSchema
            }
        }
    }
}

export const postAlunoSchema = {
    schema: {
        tags: ['Alunos'],
        summary: 'Cria um aluno',
        body: alunoBodySchema,
        response: {
            201: {
                alunoSchema
            }
        }
    }
}

export const putAlunoSchema = {
    schema: {
        tags: ['Alunos'],
        summary: 'Atualiza os dados de um aluno',
        params: alunoIdParamsSchema,
        body: alunoUpdateBodySchema,
        response: {
            200: alunoSchema
        }
    }
}

export const deleteAlunoSchema = {
    schema: {
        tags: ['Alunos'],
        summary: 'Delete um aluno',
        params: alunoIdParamsSchema,
        response: {
            200: alunoSchema
        }
    }
}
