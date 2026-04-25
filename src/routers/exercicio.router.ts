import type { FastifyInstance } from 'fastify';
import { exercicioController } from '../controllers/ExercicioController.js';
import { deleteExercicioSchema, getExercicioByIdSchema, getExercicioSchema, postExercicioSchema, putExercicioSchema } from '../schemas/exercicio.schema.js';

async function exerciciosRoutes(fastify: FastifyInstance) {
    fastify.post('/', postExercicioSchema, exercicioController.create);
    fastify.get('/', getExercicioSchema, exercicioController.get);
    fastify.get('/:id', getExercicioByIdSchema, exercicioController.getParamId);
    fastify.delete('/:id', deleteExercicioSchema, exercicioController.delete);
    fastify.put('/:id', putExercicioSchema, exercicioController.update);
}

export default exerciciosRoutes;
