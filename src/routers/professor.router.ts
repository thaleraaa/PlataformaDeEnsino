import type { FastifyInstance } from "fastify";
import { professorController } from "../controllers/ProfessorController";
import { deleteProfessorSchema, getProfessorByIdSchema, getProfessorMeSchema, getProfessorSchema, postProfessorSchema, putProfessorSchema } from "../schemas/professor.schema.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isAdministrador } from '../middlewares/isAdministrador.js';
import { isProfessor } from "../middlewares/isProfessor";


async function professoresRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postProfessorSchema, preHandler: [authMiddleware, isAdministrador] }, professorController.create);
    fastify.get('/', { ...getProfessorSchema, preHandler: [authMiddleware, isAdministrador] }, professorController.get);
    fastify.get('/:id', { ...getProfessorByIdSchema, preHandler: [authMiddleware, isProfessor] }, professorController.getParamId);   
    fastify.get('/me', {...getProfessorMeSchema, preHandler: [authMiddleware, isProfessor]}, professorController.get);
    fastify.delete('/', { ...deleteProfessorSchema, preHandler: [authMiddleware, isProfessor] }, professorController.delete);
    fastify.put('/', { ...putProfessorSchema, preHandler: [authMiddleware, isProfessor] }, professorController.update);
}

export default professoresRoutes;