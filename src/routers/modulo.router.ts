import type { FastifyInstance } from "fastify";
import { moduloController } from "../controllers/ModuloController";
import { deleteModuloSchema, getModuloByIdSchema, getModuloSchema, postModuloSchema, putModuloSchema } from '../schemas/modulo.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';
import { isProfessorOrAdministrador } from "../middlewares/isProfessorOrAdministrador";

async function modulosRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postModuloSchema, preHandler: [authMiddleware, isProfessor] }, moduloController.create);
    fastify.get('/', { ...getModuloSchema, preHandler: [authMiddleware] }, moduloController.get);
    fastify.get('/:id', { ...getModuloByIdSchema, preHandler: [authMiddleware] }, moduloController.getParamId);
    fastify.delete('/:id', { ...deleteModuloSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, moduloController.delete);
    fastify.put('/:id', { ...putModuloSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, moduloController.update);
}

export default modulosRoutes