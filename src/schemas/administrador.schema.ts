export const administradorSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
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

export const administradorBodySchema = {
    type: 'object',
    required: [
        'nome', 'email', 'ativo', 'senha'
    ],
    properties: {
        nome: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        ativo: {
            type: 'boolean'
        },
        senha: {
            type: 'string'
        }
    }
} as const;

export const administradorUpdateBodySchema = {
    type: 'object',
    properties: {
        nome: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        ativo: {
            type: 'boolean'
        }
    }
} as const;

const administradorIdParamsSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'string'
        },
    }
} as const;

export const getAdministradorSchema = {
    schema: {
        tags: ['Administradores'],
        summary: '(ADMINISTRADOR) Lista todos os administradores',
        security: [{ bearerAuth: [] }],
        response: {
            200: {
                type: 'array',
                items: administradorSchema
            },
        }
    }
}

export const getAdministradorByIdSchema = {
    schema: {
        tags: ['Administradores'],
        summary: '(ADMINISTRADOR) Busca o administrador pelo ID',
        security: [{ bearerAuth: [] }],
        params: administradorIdParamsSchema,
        response: {
            200: administradorSchema
        },
    }
}

export const getAdministradorDetail = {
    schema: {
        tags: ['Administradores'],
        summary: '(ADMINISTRADOR) Buscar informações do próprio administrador',
        security: [{ bearerAuth: []}],
        response: {
            200: administradorSchema
        }
    }
}

export const postAdministradorSchema = {
    schema: {
        tags: ['Administradores'],
        summary: '(ADMINISTRADOR) Cria um administrador',
        body: administradorBodySchema,
        response: {
            201: administradorSchema
        },
    }
}

export const putAdministradorSchema = {
    schema: {
        tags: ['Administradores'],
        summary: '(ADMINISTRADOR) Atualiza os dados do proprio administrador',
        security: [{ bearerAuth: [] }],
        params: administradorIdParamsSchema,
        body: administradorUpdateBodySchema,
        response: {
            200: administradorSchema
        },
    }
}

export const deleteAdministradorSchema = {
    schema: {
        tags: ['Administradores'],
        summary: '(ADMINISTRADOR) Delete um administrador',
        security: [{ bearerAuth: [] }],
        params: administradorIdParamsSchema,
        response: {
            200: administradorSchema
        },
    }
}