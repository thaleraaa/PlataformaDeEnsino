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
    deleteResultadoSchema,
    getResultadoByMeSchema
} from '../schemas/resultado.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';
import { isProfessorOrAdministrador } from '../middlewares/isProfessorOrAdministrador.js';

async function resultadosRoutes(fastify: FastifyInstance) {
    fastify.get('/', { ...getResultadoSchema, preHandler: [authMiddleware, isProfessor] }, resultadoController.get);
    fastify.get('/me', { ...getResultadoByMeSchema, preHandler: authMiddleware }, resultadoController.getDetail);
    fastify.get('/:resultado_id', { ...getResultadoByIdSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, resultadoController.getParamId);
    fastify.get('/aluno/:aluno_id', { ...getResultadoByAlunoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, resultadoController.getByAluno);
    fastify.get('/simulado/:simulado_id', { ...getResultadoBySimuladoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, resultadoController.getBySimulado);
    fastify.get('/aluno/:aluno_id/simulado/:simulado_id', { ...getResultadoByAlunoAndSimuladoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, resultadoController.getByAlunoAndSimulado);
    fastify.post('/', { ...createResultadoSchema, preHandler: authMiddleware }, resultadoController.create);
    fastify.put('/:resultado_id', { ...updateResultadoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, resultadoController.update);
    fastify.delete('/:resultado_id', { ...deleteResultadoSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, resultadoController.delete);
}

export default resultadosRoutes;
