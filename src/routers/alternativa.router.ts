import type { FastifyInstance } from "fastify";
import { alternativaController } from "../controllers/AlternativaController";
import { deleteAlternativaSchema, getAlternativaByIdSchema, getAlternativaSchema, postAlternativaSchema, putAlternativaSchema } from "../schemas/alternativa.schema";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';
import { isProfessorOrAdministrador } from "../middlewares/isProfessorOrAdministrador";


export function alternativasRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postAlternativaSchema, preHandler: [authMiddleware, isProfessor] }, alternativaController.create);
    fastify.get('/', { ...getAlternativaSchema, preHandler: [authMiddleware] }, alternativaController.get);
    fastify.get('/:id', { ...getAlternativaByIdSchema, preHandler: [authMiddleware] }, alternativaController.getParamId);
    fastify.delete('/:id', { ...deleteAlternativaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, alternativaController.delete);
    fastify.put('/:id', { ...putAlternativaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, alternativaController.update);
}

export default alternativasRoutes;