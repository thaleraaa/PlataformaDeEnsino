import type { FastifyRequest, FastifyReply } from "fastify";
import { ModuloRepository } from "../repositories/ModuloRepository";
import type { Modulo } from "../../generated/prisma/client";

export class ModuloController {
    private moduloRepository = new ModuloRepository();

    create = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const modulo = request.body as Omit<Modulo, 'id'>;
        const moduloCriado = await this.moduloRepository.create(modulo);
        return reply.status(201).send(moduloCriado);
    }

    get = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const modulosRetornados = await this.moduloRepository.get();
        return reply.status(200).send(modulosRetornados);
    }

    getParamId = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const modulo = await this.moduloRepository.getParamId(id);
        return reply.status(200).send(modulo);
    }

    delete = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const modulo = await this.moduloRepository.delete(id);
        return reply.status(200).send(modulo);
    }

    update = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const modulo = request.body as Partial<Omit<Modulo, 'id'>>;
        const { id } = request.params as { id: string };
        const moduloEditado = await this.moduloRepository.update(id, modulo);
        return reply.status(200).send(moduloEditado);
    }
}

export const moduloController = new ModuloController();