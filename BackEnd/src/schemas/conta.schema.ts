export const contaSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        nome: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' }
    }
} as const;

export const contaUpdateBodySchema = {
    type: 'object',
    properties: {
        nome: { type: 'string' },
        email: { type: 'string' }
    }
} as const;

export const putContaSchema = {
    schema: {
        tags: ['Contas'],
        summary: 'Atualiza nome e email da conta autenticada',
        security: [{ bearerAuth: [] }],
        body: contaUpdateBodySchema,
        response: {
            200: contaSchema
        }
    }
}
