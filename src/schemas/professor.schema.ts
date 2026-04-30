export const professorSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        CRM: {
            type: 'string'
        },
        salario: {
            type: 'number'
        },
        conta: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' }
            }
        },
        adm_id: {
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

export const professorBodySchema = {
    type: 'object',
    required: [
        'nome', 'CRM', 'salario', 'email', 'senha', 'adm_id'
    ],
    properties: {
        nome: {
            type: 'string'
        },
        CRM: {
            type: 'string'
        },
        salario: {
            type: 'number'
        },
        email: {
            type: 'string'
        },
        senha: {
            type: 'string'
        },
        adm_id: {
            type: 'string'
        }
    }
} as const;

export const professorUpdateBodySchema = {
    type: 'object',
    properties: {
        nome: {
            type: 'string'
        },
        CRM: {
            type: 'string'
        },
        salario: {
            type: 'number'
        },
        email: {
            type: 'string'
        }
    }
} as const;

const professorIdParamsSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        },
    }
} as const;

export const getProfessorSchema = {
    schema: {
        tags: ['Professores'],
        summary: 'Lista todos os professores',
        security: [{ bearerAuth: [] }],
        response: {
            200: {
                type: 'array',
                items: professorSchema
            },
        }
    }
}

export const getProfessorByIdSchema = {
    schema: {
        tags: ['Professores'],
        summary: 'Busca o professor pelo ID',
        security: [{ bearerAuth: [] }],
        params: professorIdParamsSchema,
        response: {
            200: professorSchema
        },
    }
}

export const postProfessorSchema = {
    schema: {
        tags: ['Professores'],
        summary: 'Cria um professor',
        body: professorBodySchema,
        response: {
            201: professorSchema
        },
    }
}

export const putProfessorSchema = {
    schema: {
        tags: ['Professores'],
        summary: 'Atualiza os dados de um professor',
        security: [{ bearerAuth: [] }],
        params: professorIdParamsSchema,
        body: professorUpdateBodySchema,
        response: {
            200: professorSchema
        },
    }
}

export const deleteProfessorSchema = {
    schema: {
        tags: ['Professores'],
        summary: 'Delete um professor',
        security: [{ bearerAuth: [] }],
        params: professorIdParamsSchema,
        response: {
            200: professorSchema
        },
    }
}