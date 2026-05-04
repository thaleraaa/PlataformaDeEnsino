import type { FastifyInstance } from 'fastify';
import { exercicioController } from '../controllers/ExercicioController.js';
import { deleteExercicioSchema, getExercicioByIdSchema, getExercicioSchema, postExercicioSchema, putExercicioSchema } from '../schemas/exercicio.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isProfessor } from '../middlewares/isProfessor.js';

async function exerciciosRoutes(fastify: FastifyInstance) {
    fastify.post('/', { ...postExercicioSchema, preHandler: [authMiddleware, isProfessor] }, exercicioController.create);
    fastify.get('/', getExercicioSchema, exercicioController.get);
    fastify.get('/:id', getExercicioByIdSchema, exercicioController.getParamId);
    fastify.delete('/:id', { ...deleteExercicioSchema, preHandler: [authMiddleware, isProfessor] }, exercicioController.delete);
    fastify.put('/:id', { ...putExercicioSchema, preHandler: [authMiddleware, isProfessor] }, exercicioController.update);
}

export default exerciciosRoutes;
