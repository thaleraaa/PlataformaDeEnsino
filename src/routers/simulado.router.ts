import type { FastifyInstance } from "fastify";
import { simuladoController } from "../controllers/SimuladoController";
import { createSimuladoSchema, deleteSimuladoSchema, getSimuladoByIdSchema, getSimuladoSchema, updateSimuladoSchema } from "../schemas/simulado.schema";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';

async function simuladosRoutes (fastify : FastifyInstance) {
    fastify.get('/', getSimuladoSchema, simuladoController.get);
    fastify.get('/:id', getSimuladoByIdSchema, simuladoController.getParamId);
    fastify.post('/', { ...createSimuladoSchema, preHandler: [authMiddleware, isProfessor] }, simuladoController.create);
    fastify.put('/:id', { ...updateSimuladoSchema, preHandler: [authMiddleware, isProfessor] }, simuladoController.update);
    fastify.delete('/:id', { ...deleteSimuladoSchema, preHandler: [authMiddleware, isProfessor] }, simuladoController.delete);
}

export default simuladosRoutes;