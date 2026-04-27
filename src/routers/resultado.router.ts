import type { FastifyInstance } from 'fastify';
import { resultadoController } from '../controllers/ResultadoController.js';
import {
    getResultadoSchema,
    getResultadoByIdSchema,
    getResultadoByAlunoAndSimuladoSchema,
    getResultadoByAlunoSchema,
    getResultadoBySimuladoSchema,
    createResultadoSchema,
    updateResultadoSchema,
    deleteResultadoSchema
} from '../schemas/resultado.schema.js';

async function resultadosRoutes(fastify: FastifyInstance) {
    fastify.get('/', getResultadoSchema, resultadoController.get);
    fastify.get('/:id', getResultadoByIdSchema, resultadoController.getParamId);
    fastify.get('/aluno/:aluno_id', getResultadoByAlunoSchema, resultadoController.getByAluno);
    fastify.get('/simulado/:simulado_id', getResultadoBySimuladoSchema, resultadoController.getBySimulado);
    fastify.get('/aluno/:aluno_id/simulado/:simulado_id', getResultadoByAlunoAndSimuladoSchema, resultadoController.getByAlunoAndSimulado);
    fastify.post('/', createResultadoSchema, resultadoController.create);
    fastify.put('/:id', updateResultadoSchema, resultadoController.update);
    fastify.delete('/:id', deleteResultadoSchema, resultadoController.delete);
}

export default resultadosRoutes;
