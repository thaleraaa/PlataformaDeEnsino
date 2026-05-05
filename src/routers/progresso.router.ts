import type { FastifyInstance } from "fastify";
import { progressoController } from "../controllers/ProgressoController";
import {
    getProgressoSchema,
    getProgressoByAlunoSchema,
    getProgressoByDisciplinaSchema,
    getMeProgressoSchema
} from "../schemas/progresso.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isProfessorOrAdministrador } from "../middlewares/isProfessorOrAdministrador";

async function progressoRouters(fastify: FastifyInstance) {
    fastify.get('/', { ...getProgressoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, progressoController.get);
    fastify.get('/aluno/:aluno_id', { ...getProgressoByAlunoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, progressoController.getParamAlunoId);
    fastify.get('/disciplina/:disciplina_id', { ...getProgressoByDisciplinaSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, progressoController.getParamDisciplinaId);
    fastify.get('/me', {...getMeProgressoSchema, preHandler: [authMiddleware]}, progressoController.getParamAlunoId)
}

export default progressoRouters;
