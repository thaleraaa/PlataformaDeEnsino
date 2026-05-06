import type { FastifyInstance } from "fastify";
import { moduloController } from "../controllers/ModuloController";
import { deleteModuloSchema, getAulasByModuloIdSchema, getModuloByIdSchema, getModuloSchema, postModuloSchema, putModuloSchema } from '../schemas/modulo.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';
import { isProfessorOrAdministrador } from "../middlewares/isProfessorOrAdministrador";

async function modulosRoutes(fastify: FastifyInstance) {
    fastify.post('/disciplina/:disciplina_id', { ...postModuloSchema, preHandler: [authMiddleware, isProfessor] }, moduloController.create);
    fastify.get('/', { ...getModuloSchema, preHandler: [authMiddleware] }, moduloController.get);
    fastify.get('/:modulo_id/aulas', { ...getAulasByModuloIdSchema, preHandler: [authMiddleware] }, moduloController.getAulas);
    fastify.get('/:modulo_id', { ...getModuloByIdSchema, preHandler: [authMiddleware] }, moduloController.getParamId);
    fastify.delete('/:modulo_id', { ...deleteModuloSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, moduloController.delete);
    fastify.put('/:modulo_id', { ...putModuloSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, moduloController.update);
}

export default modulosRoutes