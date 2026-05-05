import type { FastifyInstance } from "fastify";
import { simuladoController } from "../controllers/SimuladoController";
import { createSimuladoSchema, deleteSimuladoSchema, getSimuladoByIdSchema, getSimuladoSchema, updateSimuladoSchema } from "../schemas/simulado.schema";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';
import { isProfessorOrAdministrador } from "../middlewares/isProfessorOrAdministrador";

async function simuladosRoutes (fastify : FastifyInstance) {
    fastify.post('/', { ...createSimuladoSchema, preHandler: [authMiddleware, isProfessor] }, simuladoController.create);
    fastify.get('/', { ...getSimuladoSchema, preHandler: [authMiddleware] }, simuladoController.get);
    fastify.get('/:id', { ...getSimuladoByIdSchema, preHandler: [authMiddleware] }, simuladoController.getParamId);
    fastify.put('/:id', { ...updateSimuladoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, simuladoController.update);
    fastify.delete('/:id', { ...deleteSimuladoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, simuladoController.delete);
}

export default simuladosRoutes;