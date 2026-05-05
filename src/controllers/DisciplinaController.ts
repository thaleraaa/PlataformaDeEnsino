import type { FastifyRequest, FastifyReply } from "fastify";
import { DisciplinaRepository } from "../repositories/DisciplinaRepository";
import type { Disciplina } from "../../generated/prisma/client";
import { AulaRepository } from "../repositories/AulaRepository";

export class DisciplinaController {
    private disciplinaRepository = new DisciplinaRepository();
    private aulaRepository = new AulaRepository();

    create = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const disciplinaBody = request.body as Omit<Disciplina, "id">;
        const professorId = (request as any).user?.id;

        if (!professorId) {
            return reply.status(401).send({ message: "Nao autenticado" });
        }

        const disciplina = { ...disciplinaBody, professor_id: professorId };
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
        const disciplina = request.body as Omit<Disciplina, "id" | "professor_id">;
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

    getModulos = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const {id} = request.params as {id : string}
        const modulos = await this.disciplinaRepository.buscaModulos(id);
        return reply.status(200).send(modulos);
    }

    countAulas = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const totalAulas = await this.aulaRepository.countByDisciplinaId(id);
        return reply.status(200).send(totalAulas);
    }
}

export const disciplinaController = new DisciplinaController();