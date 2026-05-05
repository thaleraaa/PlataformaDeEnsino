import type { FastifyRequest, FastifyReply } from "fastify";
import type { Progresso } from "../../generated/prisma/browser";
import { ProgressoRepository } from "../repositories/ProgressoRepository";

export class ProgressoController {
    private progressoRepository = new ProgressoRepository();

    get = async(
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const progressos = await this.progressoRepository.findAll();
        return reply.status(200).send(progressos);
    }

    getParamAlunoId = async(
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const {aluno_id} = request.params as {aluno_id : string};
        const progressos = await this.progressoRepository.findByAlunoId(aluno_id);
        return reply.status(200).send(progressos);

    }

    getParamDisciplinaId = async(
        request : FastifyRequest,
        reply : FastifyReply
    ) => {
        const {disciplina_id} = request.params as {disciplina_id : string};
        const progressos = await this.progressoRepository.findByDisciplinaId(disciplina_id);
        return reply.status(200).send(progressos);
    }

}

export const progressoController = new ProgressoController();