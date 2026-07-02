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
        ativo: {
            type: 'boolean'
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
        'nome', 'CRM', 'salario', 'email', 'senha'
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
        }
    }
} as const;

export const professorUpdateBodySchema = {
    type: 'object',
    properties: {
        CRM: {
            type: 'string'
        },
        salario: {
            type: 'number'
        }
    }
} as const;

const professorIdParamsSchema = {
    type: 'object',
    required: ['professor_id'],
    properties: {
        professor_id: {
            type: 'string'
        },
    }
} as const;

export const getProfessorSchema = {
    schema: {
        tags: ['Professores'],
        summary: '(ADMINISTRADOR) Lista todos os professores',
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
        summary: '(ADMINISTRADOR) Busca o professor pelo ID',
        security: [{ bearerAuth: [] }],
        params: professorIdParamsSchema,
        response: {
            200: professorSchema
        },
    }
}

export const getProfessorMeSchema = {
    schema: {
        tags: ['Professores'],
        summary: '(PROFESSOR) Busca o próprio professor',
        security: [{ bearerAuth: [] }],
        response: {
            200: professorSchema
        },
    }
}

export const postProfessorSchema = {
    schema: {
        tags: ['Professores'],
        summary: '(ADMINISTRADOR) Cria um professor',
        security: [{bearerAuth: []}],
        body: professorBodySchema,
        response: {
            201: professorSchema
        },
    }
}

export const putProfessorSchema = {
    schema: {
        tags: ['Professores'],
        summary: '(PROFESSOR) Atualiza os dados do próprio professor',
        security: [{ bearerAuth: [] }],
        body: professorUpdateBodySchema,
        response: {
            200: professorSchema
        },
    }
}

export const deleteProfessorSchema = {
    schema: {
        tags: ['Professores'],
        summary: '(PROFESSOR) Delete o próprio professor',
        security: [{ bearerAuth: [] }],
        response: {
            200: professorSchema
        },
    }
}