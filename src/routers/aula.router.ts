import type { FastifyInstance } from 'fastify';
import { aulaController } from '../controllers/AulaController.js';
import { deleteAulaSchema, getAulaByIdSchema, getAulaSchema, postAulaSchema, putAulaSchema, getAulaCountByDisciplinaSchema } from '../schemas/aula.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessorOrAdministrador } from '../middlewares/isProfessorOrAdministrador.js';
import { isProfessor } from '../middlewares/isProfessor.js';

async function aulasRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postAulaSchema, preHandler: [authMiddleware, isProfessor] }, aulaController.create);
    fastify.get('/', { ...getAulaSchema, preHandler: [authMiddleware] }, aulaController.get);
    fastify.get('/disciplina/:disciplina_id/count', { ...getAulaCountByDisciplinaSchema, preHandler: [authMiddleware] }, aulaController.countByDisciplinaId);
    fastify.get('/:id', { ...getAulaByIdSchema, preHandler: [authMiddleware] }, aulaController.getParamId);
    fastify.delete('/:id', { ...deleteAulaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, aulaController.delete);
    fastify.put('/:id', { ...putAulaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, aulaController.update);
}

export default aulasRoutes;
