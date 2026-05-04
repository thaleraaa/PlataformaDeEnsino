import type { FastifyRequest, FastifyReply } from "fastify";
import type { Alternativa } from "../../generated/prisma/client";
import { AlternativaRepository } from "../repositories/AlternativaRepository";

export class AlternativaController {
    private alternativaRepository = new AlternativaRepository();

    create = async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        const alternativa = request.body as Omit<Alternativa, "id">;
        const novaAlternativa = await this.alternativaRepository.create(alternativa);

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
        const { id } = request.params as { id: string };
        const alternativa = await this.alternativaRepository.findById(id);
        return reply.status(200).send(alternativa);
    }

    delete = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const alternativa = await this.alternativaRepository.delete(id)
        return reply.status(200).send(alternativa);
    }

    update = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const alternativa = request.body as Partial<Omit<Alternativa, 'id'>>;
        const { id } = request.params as { id: string };
        const alternativaEditada = await this.alternativaRepository.update(id, alternativa)
        return reply.status(200).send(alternativaEditada);
    }
}

export const alternativaController = new AlternativaController();