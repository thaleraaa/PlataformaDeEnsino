import type { FastifyInstance } from 'fastify';
import { exercicioController } from '../controllers/ExercicioController.js';
import { deleteExercicioSchema, getAlternativasByExercicioSchema, getExercicioByIdSchema, getExercicioSchema, postExercicioSchema, putExercicioSchema } from '../schemas/exercicio.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';
import { isProfessorOrAdministrador } from '../middlewares/isProfessorOrAdministrador.js';

async function exerciciosRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postExercicioSchema, preHandler: [authMiddleware, isProfessor] }, exercicioController.create);
    fastify.get('/', getExercicioSchema, exercicioController.get);
    fastify.get('/:exercicio_id', getExercicioByIdSchema, exercicioController.getParamId);
    fastify.delete('/:exercicio_id', { ...deleteExercicioSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, exercicioController.delete);
    fastify.put('/:exercicio_id', { ...putExercicioSchema, preHandler: [authMiddleware, isProfessorOrAdministrador] }, exercicioController.update);
    fastify.get('/:exercicio_id/alternativas', { ...getAlternativasByExercicioSchema, preHandler: [authMiddleware] }, exercicioController.getAlternativa);
}

export default exerciciosRoutes;
