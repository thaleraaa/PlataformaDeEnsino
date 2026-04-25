import type { FastifyInstance } from "fastify";
import { moduloController } from "../controllers/ModuloController";

async function modulosRoutes(fastify : FastifyInstance) {
    fastify.post('/', moduloController.create);
    fastify.get('/', moduloController.get);
    fastify.get('/:id', moduloController.getParamId);
    fastify.delete('/:id', moduloController.delete);
    fastify.put('/:id', moduloController.update);
}

export default modulosRoutes