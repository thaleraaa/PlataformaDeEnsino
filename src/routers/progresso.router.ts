import type { FastifyInstance } from "fastify";
import { progressoController } from "../controllers/ProgressoController";
import {
    getProgressoSchema,
    getProgressoByAlunoSchema,
    getProgressoByDisciplinaSchema
} from "../schemas/progresso.schema.js";

async function progressoRouters(fastify: FastifyInstance) {
    fastify.get('/', getProgressoSchema, progressoController.get);
    fastify.get('/aluno/:aluno_id', getProgressoByAlunoSchema, progressoController.getParamAlunoId);
    fastify.get('/disciplina/:disciplina_id', getProgressoByDisciplinaSchema, progressoController.getParamDisciplinaId);
}

export default progressoRouters;
