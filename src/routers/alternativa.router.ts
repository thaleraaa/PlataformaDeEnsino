import type { FastifyInstance } from "fastify";
import { alternativaController } from "../controllers/AlternativaController";
import { deleteAlternativaSchema, getAlternativaByIdSchema, getAlternativaSchema, postAlternativaSchema, putAlternativaSchema } from "../schemas/alternativa.schema";


export function alternativasRoutes(fastify: FastifyInstance) {
    fastify.post('/', postAlternativaSchema, alternativaController.create);
    fastify.get('/', getAlternativaSchema, alternativaController.get);
    fastify.get('/:id', getAlternativaByIdSchema, alternativaController.getParamId);
    fastify.delete('/:id', deleteAlternativaSchema, alternativaController.delete);
    fastify.put('/:id', putAlternativaSchema, alternativaController.update);
}

export default alternativasRoutes;