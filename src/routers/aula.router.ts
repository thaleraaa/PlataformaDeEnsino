import type { FastifyInstance } from 'fastify';
import { aulaController } from '../controllers/AulaController.js';
import { deleteAulaSchema, getAulaByIdSchema, getAulaSchema, postAulaSchema, putAulaSchema } from '../schemas/aula.schema.js';

async function aulasRoutes(fastify: FastifyInstance) {
    fastify.post('/', postAulaSchema, aulaController.create);
    fastify.get('/', getAulaSchema, aulaController.get);
    fastify.get('/:id', getAulaByIdSchema, aulaController.getParamId);
    fastify.delete('/:id', deleteAulaSchema, aulaController.delete);
    fastify.put('/:id', putAulaSchema, aulaController.update);
}

export default aulasRoutes;
