import type { FastifyInstance } from 'fastify';
import { aulaController } from '../controllers/AulaController.js';
import { deleteAulaSchema, getAulaByIdSchema, getAulaSchema, getExerciciosByAulaSchema, postAulaSchema, putAulaSchema } from '../schemas/aula.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessorOrAdministrador } from '../middlewares/isProfessorOrAdministrador.js';
import { isProfessor } from '../middlewares/isProfessor.js';

async function aulasRoutes(fastify: FastifyInstance) {
    fastify.post('/modulo/:modulo_id', { ...postAulaSchema, preHandler: [authMiddleware, isProfessor] }, aulaController.create);
    fastify.get('/', { ...getAulaSchema, preHandler: [authMiddleware] }, aulaController.get);
    fastify.get('/:aula_id', { ...getAulaByIdSchema, preHandler: [authMiddleware] }, aulaController.getParamId);
    fastify.get('/:aula_id/exercicios', {...getExerciciosByAulaSchema,preHandler: authMiddleware}, aulaController.getParamExercicio);
    fastify.delete('/:aula_id', { ...deleteAulaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, aulaController.delete);
    fastify.put('/:aula_id', { ...putAulaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, aulaController.update);
}

export default aulasRoutes;
