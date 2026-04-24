import type { FastifyInstance } from 'fastify';
import { alunoController } from '../controllers/AlunoController.js';

async function alunosRoutes(fastify: FastifyInstance) {
    fastify.post('/', alunoController.create);
    fastify.get('/', alunoController.get);
    fastify.get('/:id', alunoController.getParamId);
    fastify.delete('/:id', alunoController.delete);
    fastify.put('/:id', alunoController.update);
}

export default alunosRoutes;

