import type { FastifyRequest, FastifyReply } from "fastify";
import { DisciplinaRepositoy } from "../repositories/DisciplinaRepository";
import type { Disciplina } from "../../generated/prisma/client";

export class DisciplinaController {
    private disciplinaRepository = new DisciplinaRepositoy();

    create = async (
        request : FastifyRequest<{Body: Omit<Disciplina,"id">}>,
        reply : FastifyReply
    ) => {
        const disciplina = request.body;
        const novoDisciplina = await this.disciplinaRepository.create(disciplina);
        return reply.status(201).send(novoDisciplina);
    }

    get = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const disciplinas = await this.disciplinaRepository.findAll();
        return reply.status(200).send(disciplinas);
    }

    getParamId = async (
        request : FastifyRequest<{Params: {id : string}}>,
        reply : FastifyReply
    ) => {
        const {id} = request.params;
        const disciplinaBuscada = await this.disciplinaRepository.findById(id);
        return reply.status(200).send(disciplinaBuscada);
    }

    update = async (
        request : FastifyRequest<{Params: {id : string}, Body: Omit<Disciplina, "id">}>,
        reply : FastifyReply
    ) => {
        const disciplina = request.body;
        const {id} = request.params;
        const disciplinaMudada = await this.disciplinaRepository.update(id, disciplina);
        return reply.status(200).send(disciplinaMudada);
    }

    delete = async (
        request : FastifyRequest<{Params: {id : string}}>,
        reply : FastifyReply
    ) => {
        const {id} = request.params;
        const disciplinaDeletada = await this.disciplinaRepository.delete(id);
        return reply.status(200).send(disciplinaDeletada);
    }
}

export const disciplinaController = new DisciplinaController();