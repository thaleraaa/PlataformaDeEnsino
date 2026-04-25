import type { FastifyInstance } from 'fastify';
import { administradorController } from '../controllers/AdministradorController';
import { deleteAdministradorSchema, getAdministradorByIdSchema, getAdministradorSchema, postAdministradorSchema, putAdministradorSchema } from '../schemas/administrador.schema.js';

async function administradoresRoutes(fastify: FastifyInstance) {
    fastify.get('/', getAdministradorSchema, administradorController.get);
    fastify.post('/', postAdministradorSchema, administradorController.create);
    fastify.get('/:id', getAdministradorByIdSchema, administradorController.getParamId);
    fastify.delete('/:id', deleteAdministradorSchema, administradorController.delete);
    fastify.put('/:id', putAdministradorSchema, administradorController.update);
}

export default administradoresRoutes;

