import type { Exercicio } from "../../generated/prisma/client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { ExercicioRepository } from "../repositories/ExercicioRepository";

export class ExercicioController {

    private exercicioRepository = new ExercicioRepository();

    create = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const exercicio = request.body as Omit<Exercicio, 'id'>;

        const professor_id = (request as any).user?.id;

        if (!professor_id) {
            return reply.status(401).send({ message: "Nao autenticado" });
        }

        const novoExercicio = await this.exercicioRepository.create({
            ...exercicio,
            professor_id,
        });
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
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const exercicio = await this.exercicioRepository.findById(id);
        return reply.status(200).send(exercicio);
    }

    delete = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const exercicio = await this.exercicioRepository.delete(id);
        return reply.status(200).send(exercicio);
    }

    update = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const exercicio = request.body as Partial<Omit<Exercicio, 'id' | 'professor_id'>>;
        const { id } = request.params as { id: string };
        const exercicioEditado = await this.exercicioRepository.update(id, exercicio);
        return reply.status(200).send(exercicioEditado);
    }
    
    getAlternativa = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const {exercicio_id} = request.params as {exercicio_id : string}
        const alternativas = await this.exercicioRepository.findAlternativaByExercicioID(exercicio_id);
        return reply.status(200).send(alternativas);
    }

}

export const exercicioController = new ExercicioController();
