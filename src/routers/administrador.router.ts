import type { FastifyInstance } from 'fastify';
import { administradorController } from '../controllers/AdministradorController';

async function administradoresRoutes(fastify: FastifyInstance) {
    fastify.get('/', administradorController.get);
    fastify.post('/', administradorController.create);
    fastify.get('/:id', administradorController.getParamId);
    fastify.delete('/:id', administradorController.delete);
    fastify.put('/:id', administradorController.update);
}

export default administradoresRoutes;

