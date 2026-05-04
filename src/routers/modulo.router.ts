import type { FastifyInstance } from "fastify";
import { moduloController } from "../controllers/ModuloController";
import { deleteModuloSchema, getModuloByIdSchema, getModuloSchema, postModuloSchema, putModuloSchema } from '../schemas/modulo.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';

async function modulosRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postModuloSchema, preHandler: [authMiddleware, isProfessor] }, moduloController.create);
    fastify.get('/', getModuloSchema, moduloController.get);
    fastify.get('/:id', getModuloByIdSchema, moduloController.getParamId);
    fastify.delete('/:id', { ...deleteModuloSchema, preHandler: [authMiddleware, isProfessor] }, moduloController.delete);
    fastify.put('/:id', { ...putModuloSchema, preHandler: [authMiddleware, isProfessor] }, moduloController.update);
}

export default modulosRoutes