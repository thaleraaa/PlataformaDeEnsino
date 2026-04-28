import type { FastifyInstance } from "fastify";
import { conclusaoAulaController } from "../controllers/ConclusaoAulaController";
import {
    getConclusaoAulaByAlunoAndAulaSchema,
    createConclusaoAulaSchema,
    deleteConclusaoAulaSchema
} from "../schemas/conclusaoAula.schema.js";

async function conclusaoAulaRouters(fastify:FastifyInstance) {
    fastify.post('/', createConclusaoAulaSchema, conclusaoAulaController.create);
    fastify.delete('/:id', deleteConclusaoAulaSchema, conclusaoAulaController.delete);
    fastify.get('/:aluno_id/:aula_id', getConclusaoAulaByAlunoAndAulaSchema, conclusaoAulaController.getParamByIdAulaIdAluno);
}

export default conclusaoAulaRouters;