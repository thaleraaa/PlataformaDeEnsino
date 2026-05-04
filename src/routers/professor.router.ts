import type { FastifyInstance } from "fastify";
import { professorController } from "../controllers/ProfessorController";
import { deleteProfessorSchema, getProfessorByIdSchema, getProfessorSchema, postProfessorSchema, putProfessorSchema } from "../schemas/professor.schema.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isAdministrador } from '../middlewares/isAdministrador.js';


async function professoresRoutes(fastify: FastifyInstance) {
    fastify.get('/', { ...getProfessorSchema, preHandler: [authMiddleware] }, professorController.get);
    fastify.post('/', { ...postProfessorSchema, preHandler: [authMiddleware, isAdministrador] }, professorController.create);
    fastify.get('/:id', { ...getProfessorByIdSchema, preHandler: [authMiddleware] }, professorController.getParamId);
    fastify.delete('/:id', { ...deleteProfessorSchema, preHandler: [authMiddleware] }, professorController.delete);
    fastify.put('/:id', { ...putProfessorSchema, preHandler: [authMiddleware] }, professorController.update);
}

export default professoresRoutes;