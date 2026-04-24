import type { FastifyInstance } from "fastify";
import { professorController } from "../controllers/ProfessorController";


async function professoresRoutes(fastify: FastifyInstance) {
    fastify.get('/', professorController.get);
    fastify.post('/', professorController.create);
    fastify.get('/:id', professorController.getParamId);
    fastify.delete('/:id', professorController.delete);
    fastify.put('/:id', professorController.update);
}

export default professoresRoutes;