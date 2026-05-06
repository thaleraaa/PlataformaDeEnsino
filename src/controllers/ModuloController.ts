import type { FastifyRequest, FastifyReply } from "fastify";
import { ModuloRepository } from "../repositories/ModuloRepository";
import type { Modulo } from "../../generated/prisma/client";

export class ModuloController {
    private moduloRepository = new ModuloRepository();

    create = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const modulo = request.body as Omit<Modulo, 'id' | 'disciplina_id'>;
        const { disciplina_id } = request.params as { disciplina_id: string };
        const moduloCriado = await this.moduloRepository.create(disciplina_id, modulo);
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
        const { modulo_id } = request.params as { modulo_id: string };
        const modulo = await this.moduloRepository.getParamId(modulo_id);
        return reply.status(200).send(modulo);
    }

    delete = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { modulo_id } = request.params as { modulo_id: string };
        const modulo = await this.moduloRepository.delete(modulo_id);
        return reply.status(200).send(modulo);
    }

    update = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const modulo = request.body as Partial<Omit<Modulo, 'id'>>;
        const { modulo_id } = request.params as { modulo_id: string };
        const moduloEditado = await this.moduloRepository.update(modulo_id, modulo);
        return reply.status(200).send(moduloEditado);
    }

    getAulas = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { modulo_id } = request.params as { modulo_id: string };
        const aulas = await this.moduloRepository.buscaAulas(modulo_id);
        return reply.status(200).send(aulas);
    }
}

export const moduloController = new ModuloController();