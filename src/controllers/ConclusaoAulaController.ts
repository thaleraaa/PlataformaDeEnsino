import type { FastifyRequest, FastifyReply } from "fastify";
import type { ConclusaoAula } from "../../generated/prisma/client";
import { ConclusaoAulaRepository } from "../repositories/ConclusaoAulaRepository";

export class ConclusaoAulaController {
    private conclusaoAulaRepository = new ConclusaoAulaRepository();

    create = async (
        request : FastifyRequest<{Body: Omit<ConclusaoAula, 'id' | 'dataConclusao' | 'created_at' | 'updated_at'>}>,
        reply : FastifyReply
    ) => {
        const conclusaoAula = request.body;
        const aulaConcluida = await this.conclusaoAulaRepository.create(conclusaoAula);
        return reply.status(201).send(aulaConcluida);
    }

    delete = async (
        request : FastifyRequest<{Params: {id : string}}>,
        reply : FastifyReply
    ) => {
        const {id} = request.params;
        const aulaNaoConcluida = await this.conclusaoAulaRepository.delete(id);
        return reply.status(200).send(aulaNaoConcluida);
    }

    getParamByIdAulaIdAluno = async (
        request : FastifyRequest<{Params: {aluno_id : string, aula_id: string}}>,
        reply : FastifyReply
    ) => {
        const {aluno_id, aula_id} = request.params;
        const conclusoesAula = await this.conclusaoAulaRepository.findByAulaEAluno(aluno_id,aula_id);
        return reply.status(200).send(conclusoesAula);
    }

}

export const conclusaoAulaController = new ConclusaoAulaController();