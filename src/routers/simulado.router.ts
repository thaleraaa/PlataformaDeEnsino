import type { FastifyInstance } from "fastify";
import { simuladoController } from "../controllers/SimuladoController";
import { createSimuladoSchema, deleteSimuladoSchema, getSimuladoByIdSchema, getSimuladoSchema, updateSimuladoSchema } from "../schemas/simulado.schema";

async function simuladosRoutes (fastify : FastifyInstance) {
    fastify.get('/', getSimuladoSchema, simuladoController.get);
    fastify.get('/:id', getSimuladoByIdSchema, simuladoController.getParamId);
    fastify.post('/', createSimuladoSchema, simuladoController.create);
    fastify.put('/:id', updateSimuladoSchema, simuladoController.update);
    fastify.delete('/:id', deleteSimuladoSchema, simuladoController.delete);
}

export default simuladosRoutes;