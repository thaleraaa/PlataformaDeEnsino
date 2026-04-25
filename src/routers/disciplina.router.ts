import type { FastifyInstance } from 'fastify';
import { disciplinaController } from '../controllers/DisciplinaController';
import { deleteDisciplinaSchema, getDisciplinaByIdSchema, getDisciplinaSchema, postDisciplinaSchema, putDisciplinaSchema } from '../schemas/disciplina.schema.js';

async function disciplinasRoutes(fastify: FastifyInstance) {
    fastify.post('/', postDisciplinaSchema, disciplinaController.create);
    fastify.get('/', getDisciplinaSchema, disciplinaController.get);
    fastify.get('/:id', getDisciplinaByIdSchema, disciplinaController.getParamId);
    fastify.delete('/:id', deleteDisciplinaSchema, disciplinaController.delete);
    fastify.put('/:id', putDisciplinaSchema, disciplinaController.update);
}

export default disciplinasRoutes;

