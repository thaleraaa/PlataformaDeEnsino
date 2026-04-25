import type { FastifyInstance } from "fastify";
import { moduloController } from "../controllers/ModuloController";
import { deleteModuloSchema, getModuloByIdSchema, getModuloSchema, postModuloSchema, putModuloSchema } from '../schemas/modulo.schema.js';

async function modulosRoutes(fastify: FastifyInstance) {
    fastify.post('/', postModuloSchema, moduloController.create);
    fastify.get('/', getModuloSchema, moduloController.get);
    fastify.get('/:id', getModuloByIdSchema, moduloController.getParamId);
    fastify.delete('/:id', deleteModuloSchema, moduloController.delete);
    fastify.put('/:id', putModuloSchema, moduloController.update);
}

export default modulosRoutes