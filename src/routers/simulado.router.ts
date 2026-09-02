import type { FastifyInstance } from "fastify";
import { simuladoController } from "../controllers/SimuladoController";
import { corrigirSimuladoSchema, createSimuladoSchema, deleteSimuladoSchema, getExerciciosBySimuladoSchema, getSimuladoByIdSchema, getSimuladoSchema, updateSimuladoSchema } from "../schemas/simulado.schema";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';
import { isProfessorOrAdministrador } from "../middlewares/isProfessorOrAdministrador";


async function simuladosRoutes (fastify : FastifyInstance) {
    fastify.post('/', { ...createSimuladoSchema, preHandler: [authMiddleware, isProfessor] }, simuladoController.create);
    fastify.get('/', { ...getSimuladoSchema, preHandler: [authMiddleware] }, simuladoController.get);
    fastify.get('/:simulado_id', { ...getSimuladoByIdSchema, preHandler: [authMiddleware] }, simuladoController.getParamId);
    fastify.get('/:simulado_id/exercicios', {...getExerciciosBySimuladoSchema, preHandler: authMiddleware}, simuladoController.getParamExercicio);
    fastify.put('/:simulado_id', { ...updateSimuladoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, simuladoController.update);
    fastify.delete('/:simulado_id', { ...deleteSimuladoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, simuladoController.delete);
    fastify.post('/:simulado_id/corrigir', { ...corrigirSimuladoSchema, preHandler: [authMiddleware] }, simuladoController.corrigir);
}

export default simuladosRoutes;