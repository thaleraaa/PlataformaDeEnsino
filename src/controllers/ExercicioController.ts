import type { Exercicio } from "../../generated/prisma/client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { ExercicioRepository } from "../repositories/ExercicioRepository";

export class ExercicioController {

    private exercicioRepository = new ExercicioRepository();

    create = async (
        request: FastifyRequest<{Body: Omit<Exercicio, 'id'>}>,
        reply: FastifyReply
    ) => {
        const exercicio = request.body;
        const novoExercicio = await this.exercicioRepository.create(exercicio);
        return reply.status(201).send(novoExercicio);
    }

    get = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const exerciciosRetornados = await this.exercicioRepository.findAll();
        return reply.status(200).send(exerciciosRetornados);
    }

    getParamId = async (
        request: FastifyRequest<{Params: {id: string}}>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const exercicio = await this.exercicioRepository.findById(id);
        return reply.status(200).send(exercicio);
    }

    delete = async (
        request: FastifyRequest<{Params: {id: string}}>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const exercicio = await this.exercicioRepository.delete(id);
        return reply.status(200).send(exercicio);
    }

    update = async (
        request: FastifyRequest<{Params: {id: string}, Body: Partial<Omit<Exercicio, 'id' | 'professor_id'>>}>,
        reply: FastifyReply
    ) => {
        const exercicio = request.body;
        const { id } = request.params;
        const exercicioEditado = await this.exercicioRepository.update(id, exercicio);
        return reply.status(200).send(exercicioEditado);
    }
    
}

export const exercicioController = new ExercicioController();
