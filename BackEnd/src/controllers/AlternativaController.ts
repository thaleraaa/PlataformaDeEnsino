import type { FastifyRequest, FastifyReply } from "fastify";
import type { Alternativa } from "../../generated/prisma/client";
import { AlternativaRepository } from "../repositories/AlternativaRepository";

export class AlternativaController {
    private alternativaRepository = new AlternativaRepository();

    create = async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        const alternativa = request.body as Omit<Alternativa, "id" | "exercicio_id">;
        const { exercicio_id } = request.params as { exercicio_id: string };
        const novaAlternativa = await this.alternativaRepository.create({
            ...alternativa,
            exercicio_id
        });

        return reply.status(201).send(novaAlternativa);
    };

    get = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const alternativas = await this.alternativaRepository.findAll();
        return reply.status(200).send(alternativas);
    }

    getParamId = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { alternativa_id } = request.params as { alternativa_id: string };
        const alternativa = await this.alternativaRepository.findById(alternativa_id);
        return reply.status(200).send(alternativa);
    }

    delete = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { alternativa_id } = request.params as { alternativa_id: string };
        const alternativa = await this.alternativaRepository.delete(alternativa_id)
        return reply.status(200).send(alternativa);
    }

    update = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const alternativa = request.body as Partial<Omit<Alternativa, 'id'>>;
        const { alternativa_id } = request.params as { alternativa_id: string };
        const alternativaEditada = await this.alternativaRepository.update(alternativa_id, alternativa)
        return reply.status(200).send(alternativaEditada);
    }
}

export const alternativaController = new AlternativaController();