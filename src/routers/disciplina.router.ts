import type { FastifyInstance } from 'fastify';
import { disciplinaController } from '../controllers/DisciplinaController';
import { deleteDisciplinaSchema, getDisciplinaByIdSchema, getDisciplinaSchema, postDisciplinaSchema, putDisciplinaSchema } from '../schemas/disciplina.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';

async function disciplinasRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postDisciplinaSchema, preHandler: [authMiddleware, isProfessor] }, disciplinaController.create);
    fastify.get('/', getDisciplinaSchema, disciplinaController.get);
    fastify.get('/:id', getDisciplinaByIdSchema, disciplinaController.getParamId);
    fastify.delete('/:id', { ...deleteDisciplinaSchema, preHandler: [authMiddleware, isProfessor] }, disciplinaController.delete);
    fastify.put('/:id', { ...putDisciplinaSchema, preHandler: [authMiddleware, isProfessor] }, disciplinaController.update);
}

export default disciplinasRoutes;

