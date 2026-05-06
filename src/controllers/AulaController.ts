import type { Aula } from "../../generated/prisma/client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { AulaRepository } from "../repositories/AulaRepository";

export class AulaController {

    private aulaRepository = new AulaRepository();

    create = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const aula = request.body as Omit<Aula, 'id' | 'modulo_id'>;
        const { modulo_id } = request.params as { modulo_id: string };
        const aulaNova = await this.aulaRepository.create(modulo_id, aula);
        return reply.status(201).send(aulaNova);
    }

    get = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const aulasRetornadas = await this.aulaRepository.findAll();
        return reply.status(200).send(aulasRetornadas);
    }

    getParamId = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { aula_id } = request.params as { aula_id: string };
        const aula = await this.aulaRepository.findById(aula_id);
        return reply.status(200).send(aula);
    }

    delete = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { aula_id } = request.params as { aula_id: string };
        const aula = await this.aulaRepository.delete(aula_id);
        return reply.status(200).send(aula);
    }

    update = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const aula = request.body as Partial<Omit<Aula, 'id'>>;
        const { aula_id } = request.params as { aula_id: string };
        const aulaEditada = await this.aulaRepository.update(aula_id, aula);
        return reply.status(200).send(aulaEditada);
    }

}

export const aulaController = new AulaController();