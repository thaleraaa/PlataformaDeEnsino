import type { FastifyInstance } from "fastify";
import { conclusaoAulaController } from "../controllers/ConclusaoAulaController";
import {
    getConclusaoAulaByAlunoAndAulaSchema,
    createConclusaoAulaSchema,
    deleteConclusaoAulaSchema
} from "../schemas/conclusaoAula.schema.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';

async function conclusaoAulaRouters(fastify:FastifyInstance) {
    fastify.post('/', { ...createConclusaoAulaSchema, preHandler: [authMiddleware] }, conclusaoAulaController.create);
    fastify.delete('/:id', { ...deleteConclusaoAulaSchema, preHandler: [authMiddleware] }, conclusaoAulaController.delete);
    fastify.get('/:aula_id', { ...getConclusaoAulaByAlunoAndAulaSchema, preHandler: [authMiddleware] }, conclusaoAulaController.getParamByIdAulaIdAluno);
}

export default conclusaoAulaRouters;