import type { FastifyRequest, FastifyReply } from "fastify";
import { AlunoRepository } from "../repositories/AlunoRepository";
import type { Aluno } from "../../generated/prisma/client.js";

export class AlunoController {
    private alunoRepository = new AlunoRepository();

    create = async (
        request: FastifyRequest<{ Body: Omit<Aluno, "id"> }>,
        reply: FastifyReply,
    ) => {
        const aluno = request.body;
        const novoAluno = await this.alunoRepository.create(aluno);

        return reply.status(201).send(novoAluno);
    };

    get = async (
        request: FastifyRequest, 
        reply: FastifyReply
    ) => {
        const alunosRetornados = await this.alunoRepository.findAll();
        return reply.status(200).send(alunosRetornados);
    }

    getParamId = async (
        request : FastifyRequest <{Params: {id : string}}>,
        reply : FastifyReply
    ) => {
        const { id } = request.params;
        const aluno = await this.alunoRepository.findById(id);
        return reply.status(200).send(aluno);
    }

    delete = async (
        request : FastifyRequest <{Params: {id : string}}>,
        reply : FastifyReply
    ) => {
        const { id } = request.params;
        const aluno = await this.alunoRepository.delete(id)
        return reply.status(200).send(aluno);
    }

    update = async (
        request : FastifyRequest <{Params: {id : string}, Body: Partial<Omit<Aluno, 'id' | 'senha'>>}>,
        reply : FastifyReply
    ) => {
        const aluno = request.body;
        const { id } = request.params;
        const alunoEditado = await this.alunoRepository.update(id, aluno)
        return reply.status(200).send(alunoEditado);
    }
}

export const alunoController = new AlunoController();