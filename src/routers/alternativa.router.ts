import type { FastifyInstance } from "fastify";
import { alternativaController } from "../controllers/AlternativaController";
import { deleteAlternativaSchema, getAlternativaByIdSchema, getAlternativaSchema, postAlternativaSchema, putAlternativaSchema } from "../schemas/alternativa.schema";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';


export function alternativasRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postAlternativaSchema, preHandler: [authMiddleware, isProfessor] }, alternativaController.create);
    fastify.get('/', { ...getAlternativaSchema, preHandler: [authMiddleware, isProfessor] }, alternativaController.get);
    fastify.get('/:id', { ...getAlternativaByIdSchema, preHandler: [authMiddleware, isProfessor] }, alternativaController.getParamId);
    fastify.delete('/:id', { ...deleteAlternativaSchema, preHandler: [authMiddleware, isProfessor] }, alternativaController.delete);
    fastify.put('/:id', { ...putAlternativaSchema, preHandler: [authMiddleware, isProfessor] }, alternativaController.update);
}

export default alternativasRoutes;