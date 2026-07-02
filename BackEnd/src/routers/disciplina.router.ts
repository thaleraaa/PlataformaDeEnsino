import type { FastifyInstance } from 'fastify';
import { disciplinaController } from '../controllers/DisciplinaController';
import { deleteDisciplinaSchema, getAulaCountByDisciplinaIdSchema, getDisciplinaByIdSchema, getDisciplinaSchema, getModulosByDisciplinaIdSchema, postDisciplinaSchema, putDisciplinaSchema } from '../schemas/disciplina.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessorOrAdministrador } from '../middlewares/isProfessorOrAdministrador.js';
import { isProfessor } from '../middlewares/isProfessor';

async function disciplinasRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postDisciplinaSchema, preHandler: [authMiddleware, isProfessor] }, disciplinaController.create);
    fastify.get('/', { ...getDisciplinaSchema, preHandler: [authMiddleware] }, disciplinaController.get);
    fastify.get('/:disciplina_id/modulos', {...getModulosByDisciplinaIdSchema, preHandler: [authMiddleware]}, disciplinaController.getModulos);
    fastify.get('/:disciplina_id/aulas/count', { ...getAulaCountByDisciplinaIdSchema, preHandler: [authMiddleware] }, disciplinaController.countAulas);
    fastify.get('/:disciplina_id', { ...getDisciplinaByIdSchema, preHandler: [authMiddleware] }, disciplinaController.getParamId);
    fastify.delete('/:disciplina_id', { ...deleteDisciplinaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, disciplinaController.delete);
    fastify.put('/:disciplina_id', { ...putDisciplinaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, disciplinaController.update);
}

export default disciplinasRoutes;

