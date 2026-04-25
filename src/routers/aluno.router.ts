import type { FastifyInstance } from 'fastify';
import { alunoController } from '../controllers/AlunoController.js';
import { deleteAlunoSchema, getAlunoByIdSchema, getAlunoSchema, postAlunoSchema, putAlunoSchema } from '../schemas/aluno.schema.js';

async function alunosRoutes(fastify: FastifyInstance) {
    fastify.post('/', postAlunoSchema, alunoController.create);
    fastify.get('/', getAlunoSchema ,alunoController.get);
    fastify.get('/:id', getAlunoByIdSchema, alunoController.getParamId);
    fastify.delete('/:id', deleteAlunoSchema, alunoController.delete);
    fastify.put('/:id', putAlunoSchema, alunoController.update);
}

export default alunosRoutes;

