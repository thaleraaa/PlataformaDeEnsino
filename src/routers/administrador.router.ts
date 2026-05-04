import type { FastifyInstance } from 'fastify';
import { administradorController } from '../controllers/AdministradorController';
import { deleteAdministradorSchema, getAdministradorByIdSchema, getAdministradorSchema, postAdministradorSchema, putAdministradorSchema } from '../schemas/administrador.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isAdministrador } from '../middlewares/isAdministrador.js';

async function administradoresRoutes(fastify: FastifyInstance) {
    fastify.get('/', { ...getAdministradorSchema, preHandler: [authMiddleware, isAdministrador] }, administradorController.get);
    fastify.post('/', { ...postAdministradorSchema, preHandler: [authMiddleware, isAdministrador] }, administradorController.create);
    fastify.get('/:id', { ...getAdministradorByIdSchema, preHandler: [authMiddleware, isAdministrador] }, administradorController.getParamId);
    fastify.delete('/:id', { ...deleteAdministradorSchema, preHandler: [authMiddleware, isAdministrador] }, administradorController.delete);
    fastify.put('/:id', { ...putAdministradorSchema, preHandler: [authMiddleware, isAdministrador] }, administradorController.update);
}

export default administradoresRoutes;

