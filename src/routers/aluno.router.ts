import type { FastifyInstance } from 'fastify';
import { alunoController } from '../controllers/AlunoController.js';
import { deleteAlunoSchema, getAlunoByIdSchema, getAlunoSchema, postAlunoSchema, putAlunoSchema } from '../schemas/aluno.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isAdministrador } from '../middlewares/isAdministrador.js';

async function alunosRoutes(fastify: FastifyInstance) {
    fastify.post('/', postAlunoSchema, alunoController.create);
    fastify.get('/', { ...getAlunoSchema, preHandler: [authMiddleware, isAdministrador] }, alunoController.get);
    fastify.get('/:id', { ...getAlunoByIdSchema, preHandler: [authMiddleware, isAdministrador] }, alunoController.getParamId);
    fastify.delete('/:id',{...deleteAlunoSchema, preHandler: [authMiddleware]}, alunoController.delete);
    fastify.put('/:id', {...putAlunoSchema, preHandler: [authMiddleware]}, alunoController.update);
}

export default alunosRoutes;