export const administradorSchema = {
  type: 'object',
  properties: {
    id: { 
        type: 'string' 
    },
    nome: { 
        type: 'string'
    },
    ativo: { 
        type: 'boolean'
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
        }
    },
} as const;

export const getAdministradorSchema = {
    schema: {
        tags: ['Administradores'],
        summary: 'Lista todos os administradores',
        response: {
            200: {
                type: 'array',
                items: administradorSchema
            }
        }
    }
}

export const getAdministradorByIdSchema = {
    schema: {
        tags: ['Administradores'],
        summary: 'Busca o administrador pelo ID',
        params: administradorIdParamsSchema,
        response: {
            200: {
                administradorSchema
            }
        }
    }
}

export const postAdministradorSchema = {
    schema: {
        tags: ['Administradores'],
        summary: 'Cria um administrador',
        body: administradorBodySchema,
        response: {
            201: {
                administradorSchema
            }
        }
    }
}

export const putAdministradorSchema = {
    schema: {
        tags: ['Administradores'],
        summary: 'Atualiza os dados de um administrador',
        params: administradorIdParamsSchema,
        body: administradorUpdateBodySchema,
        response: {
            200: administradorSchema
        }
    }
}

export const deleteAdministradorSchema = {
    schema: {
        tags: ['Administradores'],
        summary: 'Delete um administrador',
        params: administradorIdParamsSchema,
        response: {
            200: administradorSchema
        }
    }
}
