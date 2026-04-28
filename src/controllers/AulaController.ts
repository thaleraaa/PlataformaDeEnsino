import type { Aula } from "../../generated/prisma/client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { AulaRepository } from "../repositories/AulaRepository";

export class AulaController {

    private aulaRepository = new AulaRepository();

    create = async (
        request: FastifyRequest<{Body: Omit<Aula, 'id'>}>,
        reply: FastifyReply
    ) => {
        const aula = request.body;
        const aulaNova = await this.aulaRepository.create(aula);
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
        request: FastifyRequest<{Params: {id: string}}>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const aula = await this.aulaRepository.findById(id);
        return reply.status(200).send(aula);
    }

    delete = async (
        request: FastifyRequest<{Params: {id: string}}>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const aula = await this.aulaRepository.delete(id);
        return reply.status(200).send(aula);
    }

    update = async (
        request: FastifyRequest<{Params: {id: string}, Body: Partial<Omit<Aula, 'id'>>}>,
        reply: FastifyReply
    ) => {
        const aula = request.body;
        const { id } = request.params;
        const aulaEditada = await this.aulaRepository.update(id, aula);
        return reply.status(200).send(aulaEditada);
    }

    countByDisciplinaId = async (
        request : FastifyRequest<{Params: {disciplina_id : string}}>,
        reply : FastifyReply
    ) => {
        const {disciplina_id} = request.params;
        const totalAulas = await this.aulaRepository.countByDisciplinaId(disciplina_id);
        return reply.status(200).send(totalAulas);
    }
    
}

export const aulaController = new AulaController();