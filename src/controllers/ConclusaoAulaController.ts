import type { FastifyRequest, FastifyReply } from "fastify";
import type { ConclusaoAula } from "../../generated/prisma/client";
import { ConclusaoAulaRepository } from "../repositories/ConclusaoAulaRepository";
import { ProgressoRepository } from "../repositories/ProgressoRepository";
import { AulaRepository } from "../repositories/AulaRepository";

export class ConclusaoAulaController {
    private conclusaoAulaRepository = new ConclusaoAulaRepository();
    private progressoRepository = new ProgressoRepository();
    private aulaRepository = new AulaRepository();

    create = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { aluno_id, aula_id } = request.body as Omit<
            ConclusaoAula,
            'id' | 'dataConclusao' | 'created_at' | 'updated_at'
        >;
        
        const aulaConcluida = await this.conclusaoAulaRepository.create({aluno_id, aula_id });
        
        const aula = await this.aulaRepository.findByIdWithRelations(aula_id);
        
        if (aula) {
            await this.progressoRepository.upsert(aluno_id, aula.modulo.disciplina_id);
        }

        return reply.status(201).send(aulaConcluida);
    }

    delete = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { id } = request.params as { id: string };
        const aulaNaoConcluida = await this.conclusaoAulaRepository.delete(id);
        return reply.status(200).send(aulaNaoConcluida);
    }

    getParamByIdAulaIdAluno = async (
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const { aluno_id, aula_id } = request.params as { aluno_id: string; aula_id: string };
        const conclusoesAula = await this.conclusaoAulaRepository.findByAulaEAluno(aluno_id,aula_id);
        return reply.status(200).send(conclusoesAula);
    }

}

export const conclusaoAulaController = new ConclusaoAulaController();