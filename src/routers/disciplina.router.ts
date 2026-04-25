import type { FastifyInstance } from 'fastify';
import { disciplinaController } from '../controllers/DisciplinaController';

async function disciplinasRoutes(fastify: FastifyInstance) {
    fastify.post('/', disciplinaController.create);
    fastify.get('/', disciplinaController.get);
    fastify.get('/:id', disciplinaController.getParamId);
    fastify.delete('/:id', disciplinaController.delete);
    fastify.put('/:id', disciplinaController.update);
}

export default disciplinasRoutes;

