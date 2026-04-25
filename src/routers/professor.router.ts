import type { FastifyInstance } from "fastify";
import { professorController } from "../controllers/ProfessorController";
import { deleteProfessorSchema, getProfessorByIdSchema, getProfessorSchema, postProfessorSchema, putProfessorSchema } from "../schemas/professor.schema.js";


async function professoresRoutes(fastify: FastifyInstance) {
    fastify.get('/', getProfessorSchema, professorController.get);
    fastify.post('/', postProfessorSchema, professorController.create);
    fastify.get('/:id', getProfessorByIdSchema, professorController.getParamId);
    fastify.delete('/:id', deleteProfessorSchema, professorController.delete);
    fastify.put('/:id', putProfessorSchema, professorController.update);
}

export default professoresRoutes;