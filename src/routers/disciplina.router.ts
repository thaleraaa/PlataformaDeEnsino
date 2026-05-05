import type { FastifyInstance } from 'fastify';
import { disciplinaController } from '../controllers/DisciplinaController';
import { deleteDisciplinaSchema, getDisciplinaByIdSchema, getDisciplinaSchema, postDisciplinaSchema, putDisciplinaSchema } from '../schemas/disciplina.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessorOrAdministrador } from '../middlewares/isProfessorOrAdministrador.js';
import { isProfessor } from '../middlewares/isProfessor';

async function disciplinasRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postDisciplinaSchema, preHandler: [authMiddleware, isProfessor] }, disciplinaController.create);
    fastify.get('/', { ...getDisciplinaSchema, preHandler: [authMiddleware] }, disciplinaController.get);
    fastify.get('/:id', { ...getDisciplinaByIdSchema, preHandler: [authMiddleware] }, disciplinaController.getParamId);
    fastify.delete('/:id', { ...deleteDisciplinaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, disciplinaController.delete);
    fastify.put('/:id', { ...putDisciplinaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, disciplinaController.update);
}

export default disciplinasRoutes;

