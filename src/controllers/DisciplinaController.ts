import type { FastifyRequest, FastifyReply } from "fastify";
import { DisciplinaRepository } from "../repositories/DisciplinaRepository";
import type { Disciplina } from "../../generated/prisma/client";

export class DisciplinaController {
    private disciplinaRepository = new DisciplinaRepository();

    create = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const disciplina = request.body as Omit<Disciplina, "id">;
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
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const disciplinaBuscada = await this.disciplinaRepository.findById(id);
        return reply.status(200).send(disciplinaBuscada);
    }

    update = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const disciplina = request.body as Omit<Disciplina, "id">;
        const { id } = request.params as { id: string };
        const disciplinaMudada = await this.disciplinaRepository.update(id, disciplina);
        return reply.status(200).send(disciplinaMudada);
    }

    delete = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const disciplinaDeletada = await this.disciplinaRepository.delete(id);
        return reply.status(200).send(disciplinaDeletada);
    }
}

export const disciplinaController = new DisciplinaController();